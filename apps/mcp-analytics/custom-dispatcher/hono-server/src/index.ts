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

if (!process.env.POSTHOG_PROJECT_TOKEN) {
    console.error('POSTHOG_PROJECT_TOKEN is not set; MCP analytics are disabled')
}

const posthog = new PostHogMCP(process.env.POSTHOG_PROJECT_TOKEN as string, {
    host: process.env.POSTHOG_HOST,
})

const app = new Hono()

app.post('/mcp', async (c) => {
    const body = (await c.req.json()) as JsonRpcRequest
    const requestMetadata = {
        protocolVersion: c.req.header('mcp-protocol-version'),
        clientUserAgent: c.req.header('user-agent'),
        vendorClient: c.req.header('x-anthropic-client'),
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
        const tools = posthog.prepareToolList(TOOLS)
        posthog.captureToolsList({ toolNames: tools.map((tool) => tool.name), ...requestMetadata })
        return c.json({ jsonrpc: '2.0', id: body.id, result: { tools } })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const prepared = posthog.prepareToolCall(
            name,
            params.arguments as Record<string, unknown> | undefined,
            { originalTool },
        )
        const startedAt = Date.now()

        try {
            const result = runTool(name, prepared.args ?? {})
            const final = posthog.prepareToolResult(result, prepared)
            posthog.captureToolCall({
                toolName: name,
                intent: prepared.intent,
                intentSource: prepared.intentSource,
                llmModel: prepared.llmModel,
                llmModelSource: prepared.llmModelSource,
                parameters: prepared.args,
                response: final.result,
                durationMs: Date.now() - startedAt,
                isError: false,
                sessionId: final.sessionId,
                conversationId: final.conversationId,
                ...requestMetadata,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: final.result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            const final = posthog.prepareToolResult(result, prepared)
            posthog.captureToolCall({
                toolName: name,
                intent: prepared.intent,
                intentSource: prepared.intentSource,
                llmModel: prepared.llmModel,
                llmModelSource: prepared.llmModelSource,
                parameters: prepared.args,
                response: final.result,
                durationMs: Date.now() - startedAt,
                isError: true,
                errorType: err instanceof Error ? err.name : 'Error',
                sessionId: final.sessionId,
                conversationId: final.conversationId,
                ...requestMetadata,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: final.result })
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
    try {
        await posthog.shutdown(3000)
    } finally {
        process.exit(0)
    }
})
