import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributes = Record<string, boolean | number | string>

let logger: ReturnType<LoggerProvider['getLogger']> | undefined
let provider: LoggerProvider | undefined

export const posthogLogs = {
  info: (body: string, attributes?: LogAttributes) => {
    logger?.emit({ severityText: 'info', body, attributes })
  },
}

export function initializePostHogLogs(publicKey?: string, host?: string) {
  if (logger || provider)
    return

  if (!publicKey || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingKey = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.warn(`${missingKey} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingKey} is configured`)
    }
    return
  }

  provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-server',
      'deployment.environment': process.env.NODE_ENV || 'development',
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
  logger = provider.getLogger('nuxt-movies-posthog')
}

export async function shutdownPostHogLogs() {
  if (!provider)
    return

  const timeout = new Promise<void>(resolve => setTimeout(resolve, 3000))
  await Promise.race([provider.shutdown(), timeout]).catch(() => {})
  provider = undefined
  logger = undefined
}
