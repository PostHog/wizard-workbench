import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | null = null
let warnedAboutMissingConfiguration = false

function getConfiguration() {
  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST || import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (!warnedAboutMissingConfiguration && process.env.NODE_ENV !== 'production') {
      const missingVariable = !token
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
      warnedAboutMissingConfiguration = true
    }
    return null
  }

  return { token, host }
}

export function getPostHogLogLogger() {
  if (loggerProvider) {
    return loggerProvider.getLogger('posthog.invoice-actions')
  }

  const configuration = getConfiguration()
  if (!configuration) return null

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', configuration.host).toString(),
    headers: {
      Authorization: `Bearer ${configuration.token}`,
    },
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-example-basic',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })

  return loggerProvider.getLogger('posthog.invoice-actions')
}
