import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { instrument } from '@posthog/mcp'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { PostHog } from 'posthog-node'
import { z } from 'zod'

const token = process.env.POSTHOG_PROJECT_TOKEN
const host = process.env.POSTHOG_HOST

if (!token) {
    process.stderr.write(
        'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured\n'
    )
}

if (!host) {
    process.stderr.write(
        'POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured\n'
    )
}

const posthog =
    token && host
        ? new PostHog(token, { host, enableExceptionAutocapture: true })
        : undefined

const logProvider =
    token && host
        ? new LoggerProvider({
              resource: resourceFromAttributes({
                  'service.name': 'workbench-stdio-server',
              }),
              processors: [
                  new BatchLogRecordProcessor({
                      exporter: new OTLPLogExporter({
                          url: new URL('/i/v1/logs', host).toString(),
                          headers: { Authorization: `Bearer ${token}` },
                      }),
                  }),
              ],
          })
        : undefined

const posthogLogger = logProvider?.getLogger('workbench-stdio-server.posthog')

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
    posthogLogger?.emit({
        severityText: 'INFO',
        body: 'MCP STDIO server connected',
        attributes: { event: 'mcp_server_connected', transport: 'stdio' },
    })
    // STDIO transport: never write to stdout (it is the protocol channel).
}

let isShuttingDown = false

async function shutdownLogProvider(): Promise<void> {
    if (!logProvider) return

    await new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, 3000)
        void logProvider
            .shutdown()
            .catch(() => undefined)
            .finally(() => {
                clearTimeout(timeout)
                resolve()
            })
    })
}

async function shutdown(): Promise<void> {
    if (isShuttingDown) return
    isShuttingDown = true

    posthogLogger?.emit({
        severityText: 'INFO',
        body: 'MCP STDIO server shutting down',
        attributes: { event: 'mcp_server_shutdown', transport: 'stdio' },
    })

    await Promise.all([posthog?.shutdown(3000).catch(() => undefined), shutdownLogProvider()])
}

process.once('SIGTERM', () => {
    void shutdown().finally(() => process.exit(0))
})

process.stdin.once('end', () => {
    void shutdown().finally(() => process.exit(0))
})

main().catch((err) => {
    process.stderr.write(`fatal: ${String(err)}\n`)
    process.exit(1)
})
