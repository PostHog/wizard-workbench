import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

export function initializePostHogLogs() {
  if (logger || loggerProvider)
    return

  const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host)
    return

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-3-6',
      'deployment.environment': process.env.NODE_ENV || 'production',
    }),
    processors: [new BatchLogRecordProcessor({
      exporter,
      exportTimeoutMillis: 2000,
    })],
  })
  logger = loggerProvider.getLogger('posthog-movies-api')
}

export function logAuthenticationCompleted(action: 'login' | 'logout') {
  logger?.emit({
    severityText: 'INFO',
    body: 'authentication_completed',
    attributes: {
      action,
      outcome: 'success',
    },
  })
}

export async function shutdownPostHogLogs() {
  await loggerProvider?.shutdown().catch(() => {})
}
