import { serve } from '@hono/node-server'
import { PostHogMCP } from '@posthog/mcp'
import { Hono } from 'hono'

// A custom MCP dispatcher: it speaks the MCP JSON-RPC protocol directly over
// HTTP with no `@modelcontextprotocol/sdk` server object to wrap. The
// `wizard mcp-analytics` flow should recognize this as path C and instrument it
// with `PostHogMCP` (captureToolCall / captureInitialize), not `instrument()`.

type JsonRpcRequest = {
    jsonrpc: '2.0'
    id: number | string | null
    method: string
    params?: Record<string, unknown>
}

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.POSTHOG_HOST

if (!posthogProjectToken || !posthogHost) {
    throw new Error('POSTHOG_PROJECT_TOKEN and POSTHOG_HOST must be set')
}

const posthog = new PostHogMCP(posthogProjectToken, {
    host: posthogHost,
    captureModel: true,
    enableConversationId: false,
})

const TOOLS = [
    {
        name: 'echo',
        description: 'Echo a message back to the caller',
        inputSchema: {
            type: 'object',
            properties: { message: { type: 'string' } },
            required: ['message'],
        },
    },
    {
        name: 'add',
        description: 'Add two numbers',
        inputSchema: {
            type: 'object',
            properties: { a: { type: 'number' }, b: { type: 'number' } },
            required: ['a', 'b'],
        },
    },
]

function runTool(name: string, args: Record<string, unknown>): unknown {
    switch (name) {
        case 'echo':
            return { content: [{ type: 'text', text: String(args.message ?? '') }] }
        case 'add':
            return { content: [{ type: 'text', text: String(Number(args.a) + Number(args.b)) }] }
        default:
            throw new Error(`unknown tool: ${name}`)
    }
}

const ADVERTISED_TOOLS = posthog.prepareToolList(TOOLS)
const app = new Hono()

app.post('/mcp', async (c) => {
    const startedAt = Date.now()
    const body = (await c.req.json()) as JsonRpcRequest
    const clientUserAgent = c.req.header('user-agent')
    const vendorClient = c.req.header('x-anthropic-client')
    const requestProtocolVersion = c.req.header('mcp-protocol-version')
    const requestSessionId = c.req.header('mcp-session-id')

    if (body.method === 'initialize') {
        const params = body.params ?? {}
        const clientInfo = (params.clientInfo as Record<string, unknown> | undefined) ?? {}
        const protocolVersion =
            typeof params.protocolVersion === 'string' ? params.protocolVersion : requestProtocolVersion
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }

        if (protocolVersion !== '2026-07-28') {
            posthog.captureInitialize({
                clientName: typeof clientInfo.name === 'string' ? clientInfo.name : undefined,
                clientVersion: typeof clientInfo.version === 'string' ? clientInfo.version : undefined,
                parameters: params,
                response: result,
                durationMs: Date.now() - startedAt,
                sessionId: requestSessionId,
                protocolVersion,
                clientUserAgent,
                vendorClient,
            })
        }

        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const result = { tools: ADVERTISED_TOOLS }
        posthog.captureToolsList({
            toolNames: ADVERTISED_TOOLS.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            durationMs: Date.now() - startedAt,
            sessionId: requestSessionId,
            protocolVersion: requestProtocolVersion,
            clientUserAgent,
            vendorClient,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const rawArgs = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const requestMeta =
            typeof params._meta === 'object' && params._meta !== null
                ? (params._meta as Record<string, unknown>)
                : undefined
        const preparedCall = posthog.prepareToolCall(name, rawArgs, {
            originalTool,
            requestMeta,
            sessionId: requestSessionId,
        })
        const args = preparedCall.args ?? {}
        const captureCommon = {
            toolName: name,
            toolDescription: originalTool?.description,
            parameters: args,
            intent: preparedCall.intent,
            intentSource: preparedCall.intentSource,
            llmModel: preparedCall.llmModel,
            llmModelSource: preparedCall.llmModelSource,
            sessionId: preparedCall.sessionId,
            protocolVersion: requestProtocolVersion,
            clientUserAgent,
            vendorClient,
        }

        try {
            const result = runTool(name, args)
            const preparedResult = posthog.prepareToolResult(result, preparedCall)
            posthog.captureToolCall({
                ...captureCommon,
                response: preparedResult.result,
                durationMs: Date.now() - startedAt,
                isError: false,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: preparedResult.result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            const preparedResult = posthog.prepareToolResult(result, preparedCall)
            posthog.captureToolCall({
                ...captureCommon,
                response: preparedResult.result,
                durationMs: Date.now() - startedAt,
                isError: true,
                error: err,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: preparedResult.result })
        }
    }

    return c.json({
        jsonrpc: '2.0',
        id: body.id,
        error: { code: -32601, message: `method not found: ${body.method}` },
    })
})

process.on('SIGTERM', async () => {
    await posthog.shutdown()
    process.exit(0)
})

serve({ fetch: app.fetch, port: 3000 })
