import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | undefined
let logger: ReturnType<LoggerProvider['getLogger']> | undefined
let initialized = false

export function getPostHogLogLogger() {
  if (initialized)
    return logger

  initialized = true

  const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      if (!projectToken)
        console.warn('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
      if (!host)
        console.warn('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }
    return undefined
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
    timeoutMillis: 3000,
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-3-6',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  logger = loggerProvider.getLogger('posthog-movies-nuxt')

  return logger
}

export async function shutdownPostHogLogs() {
  if (loggerProvider)
    await loggerProvider.shutdown().catch(() => {})
}
