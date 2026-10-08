import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { PostHog } from 'posthog-node'

let logger: ReturnType<LoggerProvider['getLogger']> | undefined
let loggerProvider: LoggerProvider | undefined
let hasConfiguredLogger = false
let posthogClient: PostHog | undefined
let hasConfiguredPostHogClient = false

function getPostHogConfig() {
  const token = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
      )
    }
    return undefined
  }

  const host = process.env.VITE_PUBLIC_POSTHOG_HOST
  if (!host) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
      )
    }
    return undefined
  }

  return { token, host }
}

function getPostHogLogger() {
  if (hasConfiguredLogger) {
    return logger
  }

  hasConfiguredLogger = true

  const config = getPostHogConfig()
  if (!config) {
    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-example-basic',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', config.host).toString(),
          headers: {
            Authorization: `Bearer ${config.token}`,
          },
        }),
      }),
    ],
  })

  logger = loggerProvider.getLogger('posthog-integration')
  return logger
}

function getPostHogClient() {
  if (hasConfiguredPostHogClient) {
    return posthogClient
  }

  hasConfiguredPostHogClient = true

  const config = getPostHogConfig()
  if (!config) {
    return undefined
  }

  posthogClient = new PostHog(config.token, {
    host: config.host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}

export async function capturePostHogServerEvent(
  request: Request,
  event: string,
  properties: Record<string, unknown>,
) {
  const distinctId = request.headers.get('X-PostHog-Distinct-Id')
  if (!distinctId) {
    return
  }

  const client = getPostHogClient()
  if (!client) {
    return
  }

  const sessionId = request.headers.get('X-PostHog-Session-Id')
  client.capture({
    distinctId,
    event,
    properties: {
      ...properties,
      $session_id: sessionId || undefined,
    },
  })
  await client.flush()
}

export async function logPostHogIntegration(message: string) {
  const posthogLogger = getPostHogLogger()
  if (!posthogLogger || !loggerProvider) {
    return
  }

  posthogLogger.emit({
    severityText: 'info',
    body: message,
  })
  await loggerProvider.forceFlush()
}
