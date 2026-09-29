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
const missingPostHogVariable = !posthogProjectToken
    ? 'POSTHOG_PROJECT_TOKEN'
    : !posthogHost
      ? 'POSTHOG_HOST'
      : undefined

if (missingPostHogVariable && process.env.NODE_ENV !== 'production') {
    throw new Error(
        `${missingPostHogVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingPostHogVariable} is configured`,
    )
}

const posthog =
    posthogProjectToken && posthogHost
        ? new PostHogMCP(posthogProjectToken, {
              host: posthogHost,
              captureModel: true,
              enableConversationId: false,
              enableExceptionAutocapture: true,
          })
        : undefined

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
    const requestStartedAt = Date.now()
    const body = (await c.req.json()) as JsonRpcRequest
    const requestProtocolVersion =
        body.method === 'initialize' && typeof body.params?.protocolVersion === 'string'
            ? body.params.protocolVersion
            : c.req.header('MCP-Protocol-Version')
    const captureContext = {
        protocolVersion: requestProtocolVersion,
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
        const clientInfo = body.params?.clientInfo as
            | { name?: string; version?: string }
            | undefined

        if (requestProtocolVersion === '2025-11-25') {
            posthog?.captureInitialize({
                ...captureContext,
                clientName: clientInfo?.name,
                clientVersion: clientInfo?.version,
                parameters: body.params,
                response: result,
                durationMs: Date.now() - requestStartedAt,
            })
        }

        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const advertisedTools = posthog ? posthog.prepareToolList(TOOLS) : TOOLS
        const result = { tools: advertisedTools }
        posthog?.captureToolsList({
            ...captureContext,
            toolNames: advertisedTools.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            durationMs: Date.now() - requestStartedAt,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const rawArgs = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const preparedCall = posthog?.prepareToolCall(name, rawArgs, {
            originalTool,
            requestMeta: params._meta as Record<string, any> | undefined,
            sessionId: captureContext.sessionId,
        })
        const args = preparedCall ? (preparedCall.args ?? {}) : rawArgs
        const toolStartedAt = Date.now()

        try {
            const result = runTool(name, args)
            posthog?.captureToolCall({
                ...captureContext,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - toolStartedAt,
                isError: false,
                intent: preparedCall?.intent,
                intentSource: preparedCall?.intentSource,
                llmModel: preparedCall?.llmModel,
                llmModelSource: preparedCall?.llmModelSource,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result })
        } catch (err) {
            const result = {
                isError: true,
                content: [{ type: 'text', text: String(err) }],
            }
            posthog?.captureToolCall({
                ...captureContext,
                toolName: name,
                toolDescription: originalTool?.description,
                parameters: args,
                response: result,
                durationMs: Date.now() - toolStartedAt,
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

process.on('SIGTERM', async () => {
    await posthog?.shutdown()
    process.exit(0)
})

serve({ fetch: app.fetch, port: 3000 })
