import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { PostHog } from 'posthog-node'
import { instrument } from '@posthog/mcp'

const posthog = new PostHog(process.env.POSTHOG_PROJECT_TOKEN!, {
    host: process.env.POSTHOG_HOST,
})

// A minimal, PostHog-less MCP server. The `wizard mcp-analytics` flow should
// detect the McpServer object below and wrap it with `instrument(server, posthog)`.
const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })
instrument(server, posthog)

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

main().catch((err) => {
    process.stderr.write(`fatal: ${String(err)}\n`)
    process.exit(1)
})

process.on('SIGTERM', async () => {
    await posthog.shutdown()
    process.exit(0)
})
