import type { Logger } from '@opentelemetry/api-logs'
import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logger: Logger | undefined
let loggerProvider: LoggerProvider | undefined

export function initializePostHogLogger(projectToken?: string, host?: string) {
  if (loggerProvider)
    return

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${projectToken}`,
    },
  })

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-server',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })
  logger = loggerProvider.getLogger('movies-nuxt-posthog')
}

export function getPostHogLogger() {
  return logger
}

export async function shutdownPostHogLogger() {
  if (!loggerProvider)
    return

  let timeout: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<void>((resolve) => {
    timeout = setTimeout(resolve, 3000)
  })

  await Promise.race([loggerProvider.shutdown().catch(() => {}), deadline])
  clearTimeout(timeout)
}
