import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { PostHog } from 'posthog-node'
import { instrument } from '@posthog/mcp'

const posthog = process.env.POSTHOG_PROJECT_TOKEN
    ? new PostHog(process.env.POSTHOG_PROJECT_TOKEN, {
          host: process.env.POSTHOG_HOST,
          enableExceptionAutocapture: true,
      })
    : (() => {
          process.stderr.write(
              'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured\n'
          )
          return null
      })()

const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })
if (posthog) instrument(server, posthog)

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

process.on('SIGTERM', async () => {
    if (posthog) await posthog.shutdown()
    process.exit(0)
})

main().catch((err) => {
    process.stderr.write(`fatal: ${String(err)}\n`)
    process.exit(1)
})
