import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributes = Record<string, boolean | number | string>

let logger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

export function configurePostHogLogs() {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!publicKey) {
    if (isDevelopment)
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')

    return
  }

  if (!host) {
    if (isDevelopment)
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')

    return
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-server',
      'deployment.environment': process.env.NODE_ENV ?? 'production',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${publicKey}` },
        }),
      }),
    ],
  })
  logger = loggerProvider.getLogger('posthog-exporter')
}

export async function emitPostHogLog(body: string, attributes: LogAttributes) {
  if (!logger || !loggerProvider)
    return

  logger.emit({
    body,
    severityText: 'INFO',
    attributes,
  })
  await loggerProvider.forceFlush()
}
