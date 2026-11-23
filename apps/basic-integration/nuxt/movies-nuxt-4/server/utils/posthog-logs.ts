import type { Logger } from '@opentelemetry/api-logs'
import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

export function configurePostHogLogs(key?: string, host?: string) {
  if (!key || !host || loggerProvider)
    return

  const exporter = new OTLPLogExporter({
    url: new URL('i/v1/logs', `${host.replace(/\/$/, '')}/`).toString(),
    headers: {
      Authorization: `Bearer ${key}`,
    },
    timeoutMillis: 2000,
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  logger = loggerProvider.getLogger('movies-nuxt-posthog')
}

export function getPostHogLogger() {
  return logger
}

export async function shutdownPostHogLogs() {
  await loggerProvider?.shutdown().catch(() => {})
}
