import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PostHogMCP } from '@posthog/mcp'

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

const posthog = new PostHogMCP(process.env.POSTHOG_PROJECT_TOKEN!, {
    host: process.env.POSTHOG_HOST,
})

const app = new Hono()

app.post('/mcp', async (c) => {
    const body = (await c.req.json()) as JsonRpcRequest
    const sessionId = c.req.header('Mcp-Session-Id')

    if (body.method === 'initialize') {
        const params = (body.params ?? {}) as Record<string, unknown>
        const clientInfo = (params.clientInfo ?? {}) as Record<string, unknown>
        posthog.captureInitialize({
            clientName: String(clientInfo.name ?? ''),
            clientVersion: String(clientInfo.version ?? ''),
            ...(sessionId ? { sessionId } : {}),
        })
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
        return c.json({ jsonrpc: '2.0', id: body.id, result: { tools: TOOLS } })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const args = (params.arguments as Record<string, unknown>) ?? {}
        const start = Date.now()
        try {
            const result = runTool(name, args)
            posthog.captureToolCall({
                toolName: name,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
                isError: false,
                ...(sessionId ? { sessionId } : {}),
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result })
        } catch (err) {
            posthog.captureToolCall({
                toolName: name,
                parameters: args,
                response: String(err),
                durationMs: Date.now() - start,
                isError: true,
                error: err instanceof Error ? err : new Error(String(err)),
                ...(sessionId ? { sessionId } : {}),
            })
            return c.json({
                jsonrpc: '2.0',
                id: body.id,
                result: { isError: true, content: [{ type: 'text', text: String(err) }] },
            })
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
