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

export function initializePostHogLogs(config: PostHogLogConfig) {
  if (loggerProvider)
    return

  if (!config.publicKey || !config.host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !config.publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return
  }

  try {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', config.host).toString(),
      headers: {
        Authorization: `Bearer ${config.publicKey}`,
      },
      timeoutMillis: 3000,
    })

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'movies-nuxt-server',
        'deployment.environment': process.env.NODE_ENV || 'development',
      }),
      processors: [new BatchLogRecordProcessor({ exporter })],
    })
    logger = loggerProvider.getLogger('posthog-nuxt-server-logs')
  }
  catch {
    if (process.env.NODE_ENV !== 'production')
      console.warn('PostHog log exporter could not be configured')
  }
}

export function getPostHogLogger() {
  return logger
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
  clearTimeout(timeout)
}
