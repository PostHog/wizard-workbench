import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

let posthogLogger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

function getPostHogLogger(): Logger | undefined {
  if (posthogLogger)
    return posthogLogger

  const runtimeConfig = useRuntimeConfig()
  const { projectToken, host } = runtimeConfig.public.posthog

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-api',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [
      new SimpleLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('i/v1/logs', `${host.replace(/\/$/, '')}/`).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      }),
    ],
  })

  posthogLogger = loggerProvider.getLogger('posthog-nuxt-api')
  return posthogLogger
}

export async function emitPostHogLog(body: string, action: string): Promise<void> {
  const logger = getPostHogLogger()
  if (!logger)
    return

  logger.emit({
    severityText: 'info',
    body,
    attributes: { 'app.action': action },
  })
  await loggerProvider?.forceFlush()
}
