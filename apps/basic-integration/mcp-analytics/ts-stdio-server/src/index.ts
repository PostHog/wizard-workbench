import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { posthog } from './posthog.js'
import { posthogLog, shutdownPosthogLogs } from './posthog-logs.js'

// A minimal MCP server. The `wizard mcp-analytics` flow can wrap the server to
// record generic tool-call activity.
const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })

let shutdownAnalyticsPromise: Promise<void> | undefined

function shutdownAnalytics(): Promise<void> {
    shutdownAnalyticsPromise ??= Promise.all([
        posthog?.shutdown(3000).catch(() => {}),
        shutdownPosthogLogs(),
    ]).then(() => undefined)

    return shutdownAnalyticsPromise
}

process.stdin.once('end', () => {
    void shutdownAnalytics()
})
process.once('SIGTERM', () => {
    void shutdownAnalytics().finally(() => process.exit(0))
})
process.once('beforeExit', () => {
    void shutdownAnalytics()
})

server.tool(
    'echo',
    'Echo a message back to the caller',
    { message: z.string() },
    async ({ message }) => {
        posthogLog?.emit({
            severityText: 'INFO',
            body: 'MCP echo tool completed',
            attributes: { tool_name: 'echo', outcome: 'success' },
        })

        return { content: [{ type: 'text', text: message }] }
    }
)

server.tool(
    'add',
    'Add two numbers',
    { a: z.number(), b: z.number() },
    async ({ a, b }) => {
        const sum = a + b
        posthog?.capture({ event: 'addition_completed', properties: { sum } })
        posthogLog?.emit({
            severityText: 'INFO',
            body: 'MCP add tool completed',
            attributes: { tool_name: 'add', outcome: 'success' },
        })

        return { content: [{ type: 'text', text: String(sum) }] }
    }
)

async function main(): Promise<void> {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    posthogLog?.emit({
        severityText: 'INFO',
        body: 'MCP server connected to STDIO transport',
        attributes: { transport: 'stdio' },
    })
    // STDIO transport: never write to stdout (it is the protocol channel).
}

main().catch(async (err) => {
    posthog?.captureException(err)
    process.stderr.write(`fatal: ${String(err)}\n`)
    await shutdownAnalytics()
    process.exit(1)
})
