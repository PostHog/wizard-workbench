import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { PostHog } from 'posthog-node'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
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

const posthog = token && host ? new PostHog(token, { host, enableExceptionAutocapture: true }) : undefined

const logProvider =
    token && host
        ? new LoggerProvider({
              resource: resourceFromAttributes({ 'service.name': 'workbench-stdio-server' }),
              processors: [
                  new BatchLogRecordProcessor({
                      exporter: new OTLPLogExporter({
                          url: `${host}/i/v1/logs`,
                          headers: { Authorization: `Bearer ${token}` },
                      }),
                  }),
              ],
          })
        : undefined
const posthogLog = logProvider?.getLogger('posthog-log-export')

const server = new McpServer({ name: 'workbench-stdio-server', version: '1.0.0' })

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

let shutdownPromise: Promise<void> | undefined

function shutdownLogs(): Promise<void> {
    if (!logProvider) {
        return Promise.resolve()
    }

    return Promise.race([
        logProvider.shutdown(),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
    ]).catch(() => {})
}

function shutdown(): Promise<void> {
    posthogLog?.emit({ severityText: 'INFO', body: 'MCP server shutting down' })
    shutdownPromise ??= Promise.all([posthog?.shutdown(3000).catch(() => {}) ?? Promise.resolve(), shutdownLogs()]).then(
        () => {}
    )
    return shutdownPromise
}

function stop(exitCode: number): void {
    void shutdown().finally(() => process.exit(exitCode))
}

process.once('SIGTERM', () => stop(0))
process.stdin.once('end', () => stop(0))

async function main(): Promise<void> {
    const transport = new StdioServerTransport()
    posthogLog?.emit({ severityText: 'INFO', body: 'MCP server connecting to STDIO transport' })
    await server.connect(transport)
    posthogLog?.emit({ severityText: 'INFO', body: 'MCP server ready for tool requests' })
    // STDIO transport: never write to stdout (it is the protocol channel).
}

main().catch((err) => {
    process.stderr.write(`fatal: ${String(err)}\n`)
    stop(1)
})
