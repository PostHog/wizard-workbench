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

const posthog = new PostHogMCP(process.env.POSTHOG_PROJECT_TOKEN!, {
    host: process.env.POSTHOG_HOST,
})
const advertisedTools = posthog.prepareToolList(TOOLS)

if (!process.env.POSTHOG_PROJECT_TOKEN || !process.env.POSTHOG_HOST) {
    console.error('PostHog MCP analytics is disabled because its environment variables are not configured.')
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
    const protocolVersion =
        c.req.header('MCP-Protocol-Version') ??
        (typeof body.params?.protocolVersion === 'string' ? body.params.protocolVersion : undefined)
    const clientUserAgent = c.req.header('User-Agent')
    const vendorClient = c.req.header('X-Anthropic-Client')
    const sessionId = c.req.header('Mcp-Session-Id')

    if (body.method === 'initialize') {
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }
        const clientInfo = body.params?.clientInfo as Record<string, unknown> | undefined
        posthog.captureInitialize({
            clientName: typeof clientInfo?.name === 'string' ? clientInfo.name : undefined,
            clientVersion: typeof clientInfo?.version === 'string' ? clientInfo.version : undefined,
            parameters: body.params,
            response: result,
            protocolVersion: result.protocolVersion,
            clientUserAgent,
            vendorClient,
            sessionId,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        posthog.captureToolsList({
            toolNames: advertisedTools.map((tool) => tool.name),
            parameters: body.params,
            protocolVersion,
            clientUserAgent,
            vendorClient,
            sessionId,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result: { tools: advertisedTools } })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const args = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const prepared = posthog.prepareToolCall(name, args, {
            originalTool,
            requestMeta: params._meta as Record<string, unknown> | undefined,
            sessionId,
        })
        const startedAt = Date.now()
        try {
            const result = runTool(name, prepared.args ?? {})
            const final = posthog.prepareToolResult(result, prepared)
            posthog.captureToolCall({
                toolName: name,
                toolDescription: originalTool?.description,
                intent: prepared.intent,
                intentSource: prepared.intentSource,
                llmModel: prepared.llmModel,
                llmModelSource: prepared.llmModelSource,
                parameters: prepared.args,
                response: final.result,
                durationMs: Date.now() - startedAt,
                isError: false,
                protocolVersion,
                clientUserAgent,
                vendorClient,
                sessionId: final.sessionId,
                conversationId: final.conversationId,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: final.result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            const final = posthog.prepareToolResult(result, prepared)
            posthog.captureToolCall({
                toolName: name,
                toolDescription: originalTool?.description,
                intent: prepared.intent,
                intentSource: prepared.intentSource,
                llmModel: prepared.llmModel,
                llmModelSource: prepared.llmModelSource,
                parameters: prepared.args,
                response: final.result,
                durationMs: Date.now() - startedAt,
                isError: true,
                error: err,
                protocolVersion,
                clientUserAgent,
                vendorClient,
                sessionId: final.sessionId,
                conversationId: final.conversationId,
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
