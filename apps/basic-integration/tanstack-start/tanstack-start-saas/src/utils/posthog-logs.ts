import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | null = null

export function getPostHogLogger() {
  const projectToken =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ||
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !projectToken
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return null
  }

  if (!loggerProvider) {
    const exporter = new OTLPLogExporter({
      url: `${host.replace(/\/$/, '')}/i/v1/logs`,
      headers: {
        Authorization: `Bearer ${projectToken}`,
      },
    })

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'tanstack-start-example-basic',
      }),
      processors: [new BatchLogRecordProcessor(exporter)],
    })

    process.once('beforeExit', () => {
      void loggerProvider?.shutdown().catch(() => {})
    })
  }

  return loggerProvider.getLogger('posthog-invoice-lifecycle')
}
