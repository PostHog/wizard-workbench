import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

let posthogLogger: ReturnType<LoggerProvider['getLogger']> | undefined
let posthogLoggerProvider: LoggerProvider | undefined

function getPostHogLogger() {
  if (posthogLogger) return posthogLogger

  const apiKey =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const apiHost =
    process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!apiKey || !apiHost) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !apiKey
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
    return undefined
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'cloudflow-server',
      'deployment.environment': process.env.NODE_ENV ?? 'development',
    }),
    processors: [
      new SimpleLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${apiHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${apiKey}` },
        }),
      }),
    ],
  })

  posthogLoggerProvider = provider
  posthogLogger = provider.getLogger('cloudflow-posthog-logs')
  return posthogLogger
}

export async function emitPostHogLog(
  body: string,
  attributes: Record<string, boolean | number | string>,
) {
  const logger = getPostHogLogger()
  if (!logger) return

  logger.emit({ severityText: 'info', body, attributes })
  await posthogLoggerProvider?.forceFlush()
}
