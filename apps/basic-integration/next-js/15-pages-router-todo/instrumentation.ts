import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const isPostHogLogConfigured = Boolean(projectToken && apiHost)

if (!isPostHogLogConfigured && process.env.NODE_ENV === 'development') {
  const missingVariable = projectToken
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

export const loggerProvider = isPostHogLogConfigured
  ? new LoggerProvider({
      resource: resourceFromAttributes({ 'service.name': 'nextjs-todo-app' }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', apiHost!).toString(),
            headers: {
              Authorization: `Bearer ${projectToken!}`,
              'Content-Type': 'application/json',
            },
          }),
        }),
      ],
    })
  : new LoggerProvider()

export const posthogTodoLogger = loggerProvider.getLogger('posthog-todo-export')

export function register() {}

export async function flushPostHogTodoLogs() {
  await loggerProvider.forceFlush().catch(() => undefined)
}

export { SeverityNumber }
