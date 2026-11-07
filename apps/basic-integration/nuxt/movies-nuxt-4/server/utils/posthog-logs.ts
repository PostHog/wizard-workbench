import type { Logger } from '@opentelemetry/api-logs'
import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

export function initializePostHogLogs(publicKey?: string, host?: string) {
  if (!publicKey || !host) {
    if (process.env.NODE_ENV !== 'production') {
      if (!publicKey) {
        console.warn('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
      }

      if (!host) {
        console.warn('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
      }
    }

    return
  }

  const exporter = new OTLPLogExporter({
    url: new URL('/i/v1/logs', host).toString(),
    headers: {
      Authorization: `Bearer ${publicKey}`,
    },
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-4-server',
      'deployment.environment': process.env.NODE_ENV ?? 'development',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })

  logger = loggerProvider.getLogger('posthog-movies-server')
}

export function getPostHogLogger() {
  return logger
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider)
    return

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 3000)
    loggerProvider?.shutdown()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout)
        resolve()
      })
  })
}
