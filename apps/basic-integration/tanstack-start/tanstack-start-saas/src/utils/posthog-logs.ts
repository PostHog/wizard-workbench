import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logProvider: LoggerProvider | null = null
let posthogLogger: ReturnType<LoggerProvider['getLogger']> | null = null
let hasWarnedMissingConfiguration = false

function getPostHogLogConfiguration() {
  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ??
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (import.meta.env.DEV && !hasWarnedMissingConfiguration) {
      const missingVariable = !token
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
      hasWarnedMissingConfiguration = true
    }
    return null
  }

  return { host, token }
}

export function getPostHogLogger() {
  if (posthogLogger) return posthogLogger

  const configuration = getPostHogLogConfiguration()
  if (!configuration) return null

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', configuration.host).toString(),
    headers: {
      Authorization: `Bearer ${configuration.token}`,
    },
  })

  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-invoice-service',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  posthogLogger = logProvider.getLogger('posthog-invoice-lifecycle')

  const shutdown = () => {
    void logProvider?.shutdown().catch(() => {})
  }
  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)

  return posthogLogger
}
