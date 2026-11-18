import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { PostHog, instrument } from '@posthog/mcp'
import { z } from 'zod'

const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.POSTHOG_HOST

if (!posthogProjectToken) {
    process.stderr.write(
        'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured\n'
    )
}

if (!posthogHost) {
    process.stderr.write(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured\n'
    )
}

const posthog =
    posthogProjectToken && posthogHost
        ? new PostHog(posthogProjectToken, { host: posthogHost })
        : undefined

// A minimal MCP server with PostHog analytics added alongside its existing tools.
const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })
if (posthog) {
    instrument(server, posthog)
}

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

let shuttingDown = false
async function shutdown(): Promise<void> {
    if (shuttingDown) return
    shuttingDown = true

    try {
        await posthog?.shutdown(3000)
    } catch (err) {
        process.stderr.write(`PostHog shutdown warning: ${String(err)}\n`)
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
