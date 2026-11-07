import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributes = Record<string, boolean | number | string>

let logger: ReturnType<LoggerProvider['getLogger']> | undefined
let loggerProvider: LoggerProvider | undefined

export function initializePostHogLogs(projectToken: string, host: string) {
  if (loggerProvider)
    return true

  try {
    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'movies-nuxt',
        'deployment.environment': process.env.NODE_ENV || 'development',
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: {
              Authorization: `Bearer ${projectToken}`,
            },
          }),
        }),
      ],
    })
    logger = loggerProvider.getLogger('posthog-nuxt-server')
    return true
  }
  catch {
    loggerProvider = undefined
    logger = undefined
    return false
  }
}

export function emitPostHogLog(
  severityText: 'ERROR' | 'INFO' | 'WARN',
  body: string,
  attributes: LogAttributes,
) {
  logger?.emit({ severityText, body, attributes })
}

export async function shutdownPostHogLogs() {
  const shutdown = loggerProvider?.shutdown().catch(() => {})
  if (shutdown) {
    await Promise.race([
      shutdown,
      new Promise<void>((resolve) => {
        setTimeout(resolve, 3000).unref()
      }),
    ])
  }
  loggerProvider = undefined
  logger = undefined
}
