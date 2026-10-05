import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { instrument } from '@posthog/mcp'
import { PostHog } from 'posthog-node'
import { z } from 'zod'

const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.POSTHOG_HOST
const missingPostHogVariable = !projectToken
    ? 'POSTHOG_PROJECT_TOKEN'
    : !posthogHost
      ? 'POSTHOG_HOST'
      : undefined

if (missingPostHogVariable && process.env.NODE_ENV !== 'production') {
    throw new Error(
        `${missingPostHogVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingPostHogVariable} is configured`
    )
}

const posthog =
    projectToken && posthogHost
        ? new PostHog(projectToken, {
              host: posthogHost,
              enableExceptionAutocapture: true,
          })
        : undefined

// A minimal MCP server. The `wizard mcp-analytics` flow detects the McpServer
// object below and wraps it with `instrument(server, posthog)`.
const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })
if (posthog) instrument(server, posthog, { captureModel: true })

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
    await posthog?.shutdown()
    process.exit(0)
})

main().catch(async (err) => {
    posthog?.captureException(err)
    await posthog?.shutdown()
    process.stderr.write(`fatal: ${String(err)}\n`)
    process.exit(1)
})
