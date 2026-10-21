import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const projectToken =
  process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host =
  process.env.VITE_PUBLIC_POSTHOG_HOST ||
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST
const isDevelopment = process.env.NODE_ENV !== 'production'

let loggerProvider: LoggerProvider | undefined

function getLoggerProvider() {
  if (loggerProvider) return loggerProvider

  if (!projectToken) {
    if (isDevelopment) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      )
    }
    return undefined
  }

  if (!host) {
    if (isDevelopment) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
      )
    }
    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-saas',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      }),
    ],
  })

  return loggerProvider
}

export async function posthogLog(
  body: string,
  attributes: Record<string, string | number | boolean>
) {
  const provider = getLoggerProvider()
  if (!provider) return

  provider.getLogger('posthog-integration').emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body,
    attributes,
  })

  await provider.forceFlush()
}
