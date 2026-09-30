import { serve } from '@hono/node-server'
import { PostHogMCP } from '@posthog/mcp'
import { Hono } from 'hono'

const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.POSTHOG_HOST

if (!projectToken || !posthogHost) {
    throw new Error('POSTHOG_PROJECT_TOKEN and POSTHOG_HOST must be set')
}

const posthog = new PostHogMCP(projectToken, {
    host: posthogHost,
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
    const requestMetadata = {
        sessionId: c.req.header('mcp-session-id'),
        protocolVersion: c.req.header('mcp-protocol-version'),
        clientUserAgent: c.req.header('user-agent'),
        vendorClient: c.req.header('x-anthropic-client'),
    }

    if (body.method === 'initialize') {
        const startedAt = Date.now()
        const params = body.params ?? {}
        const clientInfo = params.clientInfo as Record<string, unknown> | undefined
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }
        posthog.captureInitialize({
            ...requestMetadata,
            clientName: typeof clientInfo?.name === 'string' ? clientInfo.name : undefined,
            clientVersion: typeof clientInfo?.version === 'string' ? clientInfo.version : undefined,
            protocolVersion: result.protocolVersion,
            parameters: params,
            response: result,
            durationMs: Date.now() - startedAt,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const startedAt = Date.now()
        const result = { tools: advertisedTools }
        posthog.captureToolsList({
            ...requestMetadata,
            toolNames: advertisedTools.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            durationMs: Date.now() - startedAt,
            isError: false,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const startedAt = Date.now()
        const params = body.params ?? {}
        const name = String(params.name)
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const preparedCall = posthog.prepareToolCall(
            name,
            (params.arguments as Record<string, unknown>) ?? {},
            { originalTool, sessionId: requestMetadata.sessionId },
        )
        const args = preparedCall.args ?? {}
        try {
            const result = runTool(name, args)
            posthog.captureToolCall({
                ...requestMetadata,
                sessionId: preparedCall.sessionId,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
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
                ...requestMetadata,
                sessionId: preparedCall.sessionId,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
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

async function shutdown() {
    await posthog.shutdown()
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
