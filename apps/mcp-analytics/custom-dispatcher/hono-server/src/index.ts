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
    throw new Error('POSTHOG_PROJECT_TOKEN and POSTHOG_HOST are required')
}

const posthog = new PostHogMCP(posthogProjectToken, {
    host: posthogHost,
    captureModel: true,
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

const advertisedTools = posthog.prepareToolList(TOOLS)

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

const app = new Hono()

app.post('/mcp', async (c) => {
    const body = (await c.req.json()) as JsonRpcRequest
    const clientUserAgent = c.req.header('user-agent')
    const vendorClient = c.req.header('x-anthropic-client')
    const requestProtocolVersion = c.req.header('mcp-protocol-version')
    const transportSessionId = c.req.header('mcp-session-id')

    if (body.method === 'initialize') {
        const startedAt = Date.now()
        const params = body.params ?? {}
        const clientInfo = params.clientInfo as { name?: unknown; version?: unknown } | undefined
        const response = {
            jsonrpc: '2.0' as const,
            id: body.id,
            result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
            },
        }
        posthog.captureInitialize({
            clientName: typeof clientInfo?.name === 'string' ? clientInfo.name : undefined,
            clientVersion: typeof clientInfo?.version === 'string' ? clientInfo.version : undefined,
            parameters: params,
            response: response.result,
            durationMs: Date.now() - startedAt,
            protocolVersion: response.result.protocolVersion,
            clientUserAgent,
            vendorClient,
        })
        return c.json(response)
    }

    if (body.method === 'tools/list') {
        const startedAt = Date.now()
        const result = { tools: advertisedTools }
        posthog.captureToolsList({
            toolNames: advertisedTools.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            durationMs: Date.now() - startedAt,
            protocolVersion: requestProtocolVersion,
            sessionId: transportSessionId,
            clientUserAgent,
            vendorClient,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const startedAt = Date.now()
        const params = body.params ?? {}
        const name = String(params.name)
        const args = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const preparedCall = posthog.prepareToolCall(name, args, {
            originalTool,
            requestMeta: params._meta as Record<string, unknown> | undefined,
            sessionId: transportSessionId,
        })
        try {
            const result = runTool(name, preparedCall.args ?? {})
            const preparedResult = posthog.prepareToolResult(result, preparedCall)
            posthog.captureToolCall({
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: preparedCall.args,
                response: preparedResult.result,
                durationMs: Date.now() - startedAt,
                isError: false,
                intent: preparedCall.intent,
                intentSource: preparedCall.intentSource,
                llmModel: preparedCall.llmModel,
                llmModelSource: preparedCall.llmModelSource,
                protocolVersion: requestProtocolVersion,
                sessionId: preparedResult.sessionId,
                conversationId: preparedResult.conversationId,
                clientUserAgent,
                vendorClient,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: preparedResult.result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            const preparedResult = posthog.prepareToolResult(result, preparedCall)
            posthog.captureToolCall({
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: preparedCall.args,
                response: preparedResult.result,
                durationMs: Date.now() - startedAt,
                isError: true,
                error: err,
                intent: preparedCall.intent,
                intentSource: preparedCall.intentSource,
                llmModel: preparedCall.llmModel,
                llmModelSource: preparedCall.llmModelSource,
                protocolVersion: requestProtocolVersion,
                sessionId: preparedResult.sessionId,
                conversationId: preparedResult.conversationId,
                clientUserAgent,
                vendorClient,
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

serve({ fetch: app.fetch, port: 3000 })

process.on('SIGTERM', async () => {
    await posthog.shutdown()
    process.exit(0)
})
