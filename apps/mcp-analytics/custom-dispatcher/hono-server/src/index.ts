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

const ADVERTISED_TOOLS = posthog.prepareToolList(TOOLS)

function asRecord(value: unknown): Record<string, unknown> | undefined {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : undefined
}

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
    const requestAnalytics = {
        protocolVersion: c.req.header('MCP-Protocol-Version'),
        clientUserAgent: c.req.header('User-Agent'),
        vendorClient: c.req.header('X-Anthropic-Client'),
    }

    if (body.method === 'initialize') {
        return c.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
            },
        })
    }

    if (body.method === 'tools/list') {
        const start = Date.now()
        const result = { tools: ADVERTISED_TOOLS }
        posthog.captureToolsList({
            ...requestAnalytics,
            toolNames: ADVERTISED_TOOLS.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            durationMs: Date.now() - start,
            isError: false,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const start = Date.now()
        const params = body.params ?? {}
        const name = String(params.name)
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const preparedCall = posthog.prepareToolCall(name, asRecord(params.arguments), {
            originalTool,
            requestMeta: asRecord(params._meta),
        })
        const args = preparedCall.args ?? {}

        try {
            const result = runTool(name, args)
            posthog.captureToolCall({
                ...requestAnalytics,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
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
                ...requestAnalytics,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
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
