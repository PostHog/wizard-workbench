import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (!posthogProjectToken) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    )
  }
} else if (!posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
    )
  }
}

export const posthogLogProvider =
  posthogProjectToken && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          'service.name': 'todo-app',
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogProjectToken}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : null

export const posthogLog = posthogLogProvider
  ? posthogLogProvider.getLogger('posthog-todo-integration')
  : null

export { SeverityNumber }

export async function flushPosthogLogs() {
  await posthogLogProvider?.forceFlush()
}

export function register() {}
