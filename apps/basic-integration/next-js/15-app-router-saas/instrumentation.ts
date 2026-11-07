import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const hasPostHogLogConfiguration = Boolean(projectToken && posthogHost)

if (!hasPostHogLogConfiguration && process.env.NODE_ENV !== 'production') {
  const missingVariable = projectToken
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  )
}

export const posthogLoggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'next-js-saas'
  }),
  processors: hasPostHogLogConfiguration
    ? [
        new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: `${posthogHost}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${projectToken}`,
              'Content-Type': 'application/json'
            },
            timeoutMillis: 2000
          })
        )
      ]
    : []
})

export function register() {}
