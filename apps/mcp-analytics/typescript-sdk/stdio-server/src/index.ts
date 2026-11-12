import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { PostHog, instrument } from '@posthog/mcp'
import { z } from 'zod'

if (!process.env.POSTHOG_PROJECT_TOKEN) {
    process.stderr.write('PostHog MCP analytics is disabled: POSTHOG_PROJECT_TOKEN is not set.\n')
}

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN!, {
    host: process.env.POSTHOG_HOST,
})

const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })
const analytics = instrument(server, posthog)

server.tool(
    'echo',
    'Echo a message back to the caller',
    { message: z.string() },
    async ({ message }) => ({ content: [{ type: 'text', text: message }] })
)

server.tool(
    'add',
    'Add two numbers',
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({ content: [{ type: 'text', text: String(a + b) }] })
)

async function main(): Promise<void> {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    // STDIO transport: never write to stdout (it is the protocol channel).
}

let isShuttingDown = false

async function shutdown(): Promise<void> {
    if (isShuttingDown) return
    isShuttingDown = true

    try {
        await posthog.shutdown(3000)
    } finally {
        process.exit(0)
    }
}

process.once('SIGTERM', () => {
    void shutdown()
})

process.stdin.once('end', () => {
    void shutdown()
})

main().catch((err) => {
    process.stderr.write(`fatal: ${String(err)}\n`)
    process.exit(1)
})
