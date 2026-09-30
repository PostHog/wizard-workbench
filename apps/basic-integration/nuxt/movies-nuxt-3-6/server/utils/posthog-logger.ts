import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NUXT_PUBLIC_POSTHOG_HOST
const isDevelopment = process.env.NODE_ENV === 'development'

let loggerProvider: LoggerProvider | undefined
let posthogLogger: ReturnType<LoggerProvider['getLogger']> | undefined
let initializationAttempted = false

function getPostHogLogger() {
  if (initializationAttempted)
    return posthogLogger

  if (!projectToken || !posthogHost) {
    if (isDevelopment) {
      const missingVariable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    initializationAttempted = true
    return undefined
  }

  initializationAttempted = true

  const exporter = new OTLPLogExporter({
    url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  })

  loggerProvider = new LoggerProvider({
    resource: new Resource({
      'service.name': 'movies-nuxt-3-6',
    }),
  })
  loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(exporter))
  posthogLogger = loggerProvider.getLogger('movies-nuxt-posthog')

  return posthogLogger
}

export async function emitPostHogLog(message: string, operation: string) {
  const logger = getPostHogLogger()
  if (!logger || !loggerProvider)
    return

  try {
    logger.emit({
      severityText: 'info',
      body: message,
      attributes: { operation },
    })
    await loggerProvider.forceFlush()
  }
  catch {
    // Log delivery must not affect the authenticated request.
  }
}
