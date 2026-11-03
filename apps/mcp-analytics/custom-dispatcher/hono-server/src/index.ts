import 'dotenv/config'

import { serve } from '@hono/node-server'
import { PostHogMCP, type PreparedToolCall } from '@posthog/mcp'
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

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.POSTHOG_HOST

if ((!posthogProjectToken || !posthogHost) && process.env.NODE_ENV !== 'production') {
    const missingVariable = posthogProjectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN'
    throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
}

const posthog =
    posthogProjectToken && posthogHost
        ? new PostHogMCP(posthogProjectToken, { host: posthogHost })
        : null
const advertisedTools = posthog ? posthog.prepareToolList(TOOLS) : TOOLS

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
    const startedAt = Date.now()
    const protocolVersion = c.req.header('MCP-Protocol-Version')
    const sessionId = c.req.header('Mcp-Session-Id')
    const clientUserAgent = c.req.header('User-Agent')
    const vendorClient = c.req.header('X-Anthropic-Client')
    const captureContext = { protocolVersion, sessionId, clientUserAgent, vendorClient }

    if (body.method === 'initialize') {
        const params = body.params ?? {}
        const clientInfo = (params.clientInfo as Record<string, unknown>) ?? {}
        const result = {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'workbench-hono-dispatcher', version: '1.0.0' },
        }
        posthog?.captureInitialize({
            ...captureContext,
            clientName: typeof clientInfo.name === 'string' ? clientInfo.name : undefined,
            clientVersion: typeof clientInfo.version === 'string' ? clientInfo.version : undefined,
            protocolVersion:
                typeof params.protocolVersion === 'string'
                    ? params.protocolVersion
                    : protocolVersion,
            parameters: params,
            response: result,
            durationMs: Date.now() - startedAt,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/list') {
        const result = { tools: advertisedTools }
        posthog?.captureToolsList({
            ...captureContext,
            toolNames: advertisedTools.map((tool) => tool.name),
            parameters: body.params,
            response: result,
            durationMs: Date.now() - startedAt,
        })
        return c.json({ jsonrpc: '2.0', id: body.id, result })
    }

    if (body.method === 'tools/call') {
        const params = body.params ?? {}
        const name = String(params.name)
        const args = (params.arguments as Record<string, unknown>) ?? {}
        const originalTool = TOOLS.find((tool) => tool.name === name)
        const prepared: PreparedToolCall = posthog
            ? posthog.prepareToolCall(name, args, {
                  originalTool,
                  requestMeta: (params._meta as Record<string, unknown>) ?? undefined,
                  sessionId,
              })
            : { args, isMissingCapability: false, isFeedback: false }
        try {
            const result = runTool(name, prepared.args ?? {})
            const final = posthog
                ? posthog.prepareToolResult(result, prepared)
                : { result, sessionId }
            posthog?.captureToolCall({
                ...captureContext,
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
                sessionId: final.sessionId,
                conversationId: final.conversationId,
            })
            return c.json({ jsonrpc: '2.0', id: body.id, result: final.result })
        } catch (err) {
            const result = {
                isError: true,
                content: [{ type: 'text' as const, text: String(err) }],
            }
            const final = posthog
                ? posthog.prepareToolResult(result, prepared)
                : { result, sessionId }
            posthog?.captureToolCall({
                ...captureContext,
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
    await posthog?.shutdown()
    process.exit(0)
})
