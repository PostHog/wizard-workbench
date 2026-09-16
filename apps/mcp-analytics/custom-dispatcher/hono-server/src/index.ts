import { serve } from '@hono/node-server'
import { PostHogMCP } from '@posthog/mcp'
import { Hono } from 'hono'

function requireEnv(name: 'POSTHOG_PROJECT_TOKEN' | 'POSTHOG_HOST'): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`${name} is required`)
    }
    return value
}

const posthog = new PostHogMCP(requireEnv('POSTHOG_PROJECT_TOKEN'), {
    host: requireEnv('POSTHOG_HOST'),
    captureModel: true,
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
    const requestProtocolVersion = c.req.header('MCP-Protocol-Version')
    const clientUserAgent = c.req.header('User-Agent')
    const vendorClient = c.req.header('x-anthropic-client')

    if (body.method === 'initialize') {
        const start = Date.now()
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }
        const clientInfo = body.params?.clientInfo as Record<string, unknown> | undefined
        posthog.captureInitialize({
            clientName: typeof clientInfo?.name === 'string' ? clientInfo.name : undefined,
            clientVersion: typeof clientInfo?.version === 'string' ? clientInfo.version : undefined,
            protocolVersion:
                typeof body.params?.protocolVersion === 'string'
                    ? body.params.protocolVersion
                    : requestProtocolVersion ?? result.protocolVersion,
            clientUserAgent,
            vendorClient,
            parameters: body.params,
            response: result,
            durationMs: Date.now() - start,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const start = Date.now()
        const tools = posthog.prepareToolList(TOOLS)
        const result = { tools }
        posthog.captureToolsList({
            toolNames: tools.map((tool) => tool.name),
            protocolVersion: requestProtocolVersion,
            clientUserAgent,
            vendorClient,
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
        const rawArgs = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const prepared = posthog.prepareToolCall(name, rawArgs, {
            originalTool,
            requestMeta: params._meta as Record<string, unknown> | undefined,
        })
        const args = prepared.args ?? {}
        try {
            const result = runTool(name, args)
            posthog.captureToolCall({
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
                isError: false,
                intent: prepared.intent,
                intentSource: prepared.intentSource,
                llmModel: prepared.llmModel,
                llmModelSource: prepared.llmModelSource,
                protocolVersion: requestProtocolVersion,
                clientUserAgent,
                vendorClient,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            posthog.captureToolCall({
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
                isError: true,
                error: err,
                intent: prepared.intent,
                intentSource: prepared.intentSource,
                llmModel: prepared.llmModel,
                llmModelSource: prepared.llmModelSource,
                protocolVersion: requestProtocolVersion,
                clientUserAgent,
                vendorClient,
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
