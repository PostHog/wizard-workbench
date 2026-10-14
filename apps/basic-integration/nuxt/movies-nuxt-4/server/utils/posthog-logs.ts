import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

interface PostHogLogConfig {
  publicKey?: string
  host?: string
}

let logger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

function getPostHogLogger(config: PostHogLogConfig) {
  if (logger)
    return logger

  if (!config.publicKey || !config.host) {
    if (import.meta.dev) {
      const missingVariable = !config.publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return undefined
  }

  const exporter = new OTLPLogExporter({
    url: `${config.host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${config.publicKey}`,
    },
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-4',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  logger = loggerProvider.getLogger('posthog-movies-nuxt-4')

  return logger
}

export async function emitPostHogLog(
  config: PostHogLogConfig,
  body: string,
  attributes: Record<string, string>,
) {
  const posthogLogger = getPostHogLogger(config)
  if (!posthogLogger || !loggerProvider)
    return

  try {
    posthogLogger.emit({
      severityText: 'INFO',
      body,
      attributes,
    })

    await loggerProvider.forceFlush()
  }
  catch {
  }
}
