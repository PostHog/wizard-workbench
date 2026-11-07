import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributes = Record<string, string | number | boolean>

interface PostHogLogConfig {
  publicKey?: string
  host?: string
}

let logger: ReturnType<LoggerProvider['getLogger']> | undefined
let flushLogger: (() => Promise<void>) | undefined
let shutdownLogger: (() => Promise<void>) | undefined
let initialized = false

export function initializePostHogLogs(config: PostHogLogConfig) {
  if (initialized)
    return

  initialized = true

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
    const provider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'nuxt-movies',
      }),
      processors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${config.host.replace(/\/$/, '')}/i/v1/logs`,
            headers: {
              Authorization: `Bearer ${config.publicKey}`,
            },
            timeoutMillis: 2000,
          }),
        }),
      ],
    })

    logger = provider.getLogger('nuxt-movies.posthog')
    flushLogger = () => provider.forceFlush()
    shutdownLogger = () => provider.shutdown()
  }
  catch (error) {
    console.warn('PostHog log exporter could not be initialized', error)
  }
}

export async function emitPostHogLog(
  severityText: 'INFO' | 'WARN' | 'ERROR',
  body: string,
  attributes: LogAttributes,
) {
  logger?.emit({ severityText, body, attributes })
  await flushLogger?.().catch(() => {})
}

export async function shutdownPostHogLogs() {
  await shutdownLogger?.().catch(() => {})
}
