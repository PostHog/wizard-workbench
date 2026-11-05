import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const apiKey = process.env.POSTHOG_API_KEY
const host = process.env.POSTHOG_HOST

const loggerProvider = apiKey && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'workbench-stdio-server' }),
        processors: [
            new BatchLogRecordProcessor({
                exporter: new OTLPLogExporter({
                    url: new URL('/i/v1/logs', host).toString(),
                    headers: { Authorization: `Bearer ${apiKey}` },
                    timeoutMillis: 3000,
                }),
            }),
        ],
    })
    : undefined

// This provider is intentionally isolated: it exports only records emitted below.
export const posthogLog = loggerProvider?.getLogger('posthog-mcp-lifecycle')

export async function shutdownPosthogLogs(): Promise<void> {
    await loggerProvider?.shutdown().catch(() => {})
}
