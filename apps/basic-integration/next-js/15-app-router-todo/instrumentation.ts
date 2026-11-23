import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if ((!token || !host) && process.env.NODE_ENV !== 'production') {
  const missingVariable = token
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  )
}

export const posthogLoggerProvider =
  token && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({ 'service.name': 'todo-app' }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host.replace(/\/$/, '')}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }),
          }),
        ],
      })
    : null

export const posthogTodoLogger = posthogLoggerProvider?.getLogger(
  'posthog-todo-log-exporter'
)

export async function flushPostHogLogs() {
  await posthogLoggerProvider?.forceFlush().catch(() => {})
}

export function register() {}
