import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const serviceName = 'movies-nuxt-server'

let loggerProvider: LoggerProvider | undefined
let posthogLogger: ReturnType<LoggerProvider['getLogger']> | undefined

function getPostHogLogger() {
  if (posthogLogger)
    return posthogLogger

  const { publicKey, host } = useRuntimeConfig().public.posthog

  if (!publicKey || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': serviceName,
      'deployment.environment': process.env.NODE_ENV ?? 'production',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${publicKey}` },
        }),
      }),
    ],
  })
  posthogLogger = loggerProvider.getLogger('posthog-exporter')

  return posthogLogger
}

export async function logPostHogServer(message: string, attributes: Record<string, string>) {
  const logger = getPostHogLogger()
  if (!logger || !loggerProvider)
    return

  logger.emit({
    severityText: 'info',
    body: message,
    attributes,
  })

  try {
    await loggerProvider.forceFlush()
  }
  catch {
    // Log delivery must not interrupt the user request.
  }
}
