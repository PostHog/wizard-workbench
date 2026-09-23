import { serve } from '@hono/node-server'
import { PostHogMCP } from '@posthog/mcp'
import { Hono } from 'hono'

const posthog = new PostHogMCP(process.env.POSTHOG_PROJECT_TOKEN!, {
    host: process.env.POSTHOG_HOST,
    captureModel: true,
    enableConversationId: false,
})

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

const app = new Hono()

app.post('/mcp', async (c) => {
    const body = (await c.req.json()) as JsonRpcRequest
    const initializeProtocolVersion =
        body.method === 'initialize' && typeof body.params?.protocolVersion === 'string'
            ? body.params.protocolVersion
            : undefined
    const analyticsContext = {
        protocolVersion: c.req.header('MCP-Protocol-Version') ?? initializeProtocolVersion,
        sessionId: c.req.header('Mcp-Session-Id'),
        clientUserAgent: c.req.header('User-Agent'),
        vendorClient: c.req.header('X-Anthropic-Client'),
    }

    if (body.method === 'initialize') {
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }
        if (initializeProtocolVersion === '2025-11-25') {
            const clientInfo = body.params?.clientInfo as Record<string, unknown> | undefined
            posthog.captureInitialize({
                ...analyticsContext,
                clientName: typeof clientInfo?.name === 'string' ? clientInfo.name : undefined,
                clientVersion: typeof clientInfo?.version === 'string' ? clientInfo.version : undefined,
                parameters: body.params,
                response: result,
            })
        }
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const tools = posthog.prepareToolList(TOOLS)
        const result = { tools }
        posthog.captureToolsList({
            ...analyticsContext,
            toolNames: tools.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            isError: false,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const args = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const preparedCall = posthog.prepareToolCall(name, args, {
            originalTool,
            requestMeta: params._meta as Record<string, unknown> | undefined,
            sessionId: analyticsContext.sessionId,
        })
        const startedAt = Date.now()
        try {
            const result = runTool(name, preparedCall.args ?? {})
            posthog.captureToolCall({
                ...analyticsContext,
                sessionId: preparedCall.sessionId,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: preparedCall.args,
                response: result,
                durationMs: Date.now() - startedAt,
                isError: false,
                intent: preparedCall.intent,
                intentSource: preparedCall.intentSource,
                llmModel: preparedCall.llmModel,
                llmModelSource: preparedCall.llmModelSource,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            posthog.captureToolCall({
                ...analyticsContext,
                sessionId: preparedCall.sessionId,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: preparedCall.args,
                response: result,
                durationMs: Date.now() - startedAt,
                isError: true,
                error: err,
                intent: preparedCall.intent,
                intentSource: preparedCall.intentSource,
                llmModel: preparedCall.llmModel,
                llmModelSource: preparedCall.llmModelSource,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result })
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
