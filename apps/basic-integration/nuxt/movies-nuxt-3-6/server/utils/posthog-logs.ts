import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | undefined
let posthogLogger: Logger | undefined
let configured = false

export function configurePostHogLogs(projectToken?: string, host?: string) {
  if (configured)
    return
  configured = true

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-3-6',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      }),
    ],
  })
  posthogLogger = loggerProvider.getLogger('posthog-movies-server')
}

export function getPostHogLogger() {
  return posthogLogger
}

export async function shutdownPostHogLogs() {
  if (!loggerProvider)
    return

  let timeout: ReturnType<typeof setTimeout> | undefined
  await Promise.race([
    loggerProvider.shutdown().catch(() => {}),
    new Promise<void>((resolve) => {
      timeout = setTimeout(resolve, 3000)
    }),
  ])
  if (timeout)
    clearTimeout(timeout)
}
