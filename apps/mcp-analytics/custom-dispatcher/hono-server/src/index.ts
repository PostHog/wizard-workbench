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

const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.POSTHOG_HOST

if ((!projectToken || !posthogHost) && process.env.NODE_ENV !== 'production') {
    throw new Error(
        'POSTHOG_PROJECT_TOKEN and POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once both variables are configured',
    )
}

const posthog =
    projectToken && posthogHost
        ? new PostHogMCP(projectToken, {
              host: posthogHost,
              captureModel: true,
              enableConversationId: false,
              enableExceptionAutocapture: true,
          })
        : undefined

const app = new Hono()

app.post('/mcp', async (c) => {
    const body = (await c.req.json()) as JsonRpcRequest
    const captureContext = {
        protocolVersion: c.req.header('MCP-Protocol-Version'),
        clientUserAgent: c.req.header('user-agent'),
        vendorClient: c.req.header('x-anthropic-client'),
    }

    if (body.method === 'initialize') {
        const start = Date.now()
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }
        const rawClientInfo = body.params?.clientInfo
        const clientInfo =
            rawClientInfo && typeof rawClientInfo === 'object'
                ? (rawClientInfo as Record<string, unknown>)
                : undefined

        posthog?.captureInitialize({
            ...captureContext,
            protocolVersion: result.protocolVersion,
            clientName: typeof clientInfo?.name === 'string' ? clientInfo.name : undefined,
            clientVersion: typeof clientInfo?.version === 'string' ? clientInfo.version : undefined,
            parameters: body.params,
            response: result,
            durationMs: Date.now() - start,
        })

        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const start = Date.now()
        const tools = posthog?.prepareToolList(TOOLS) ?? TOOLS
        const result = { tools }

        posthog?.captureToolsList({
            ...captureContext,
            toolNames: tools.map((tool) => tool.name),
            parameters: body.params,
            durationMs: Date.now() - start,
        })

        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const start = Date.now()
        const params = body.params ?? {}
        const name = String(params.name)
        const rawArgs = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const rawRequestMeta = params._meta
        const requestMeta =
            rawRequestMeta && typeof rawRequestMeta === 'object'
                ? (rawRequestMeta as Record<string, unknown>)
                : undefined
        const preparedCall = posthog?.prepareToolCall(name, rawArgs, {
            originalTool,
            requestMeta,
        })
        const args = posthog ? (preparedCall?.args ?? {}) : rawArgs

        try {
            const result = runTool(name, args)
            posthog?.captureToolCall({
                ...captureContext,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
                isError: false,
                intent: preparedCall?.intent,
                intentSource: preparedCall?.intentSource,
                llmModel: preparedCall?.llmModel,
                llmModelSource: preparedCall?.llmModelSource,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result })
        } catch (err) {
            const result = { isError: true, content: [{ type: 'text', text: String(err) }] }
            posthog?.captureToolCall({
                ...captureContext,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - start,
                isError: true,
                error: err,
                intent: preparedCall?.intent,
                intentSource: preparedCall?.intentSource,
                llmModel: preparedCall?.llmModel,
                llmModelSource: preparedCall?.llmModelSource,
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
    await posthog?.shutdown()
    process.exit(0)
})
