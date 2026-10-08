import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

interface PostHogLogConfig {
  public: {
    posthog: {
      publicKey?: string
      host?: string
    }
  }
}

let logProcessor: BatchLogRecordProcessor | undefined
let initialized = false

function initializePostHogLogs(config: PostHogLogConfig) {
  if (initialized)
    return true

  const { publicKey, host } = config.public.posthog
  if (!publicKey || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = publicKey
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return false
  }

  logProcessor = new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: { Authorization: `Bearer ${publicKey}` },
    }),
  })

  new NodeSDK({
    resource: resourceFromAttributes({ 'service.name': 'movies-nuxt' }),
    logRecordProcessors: [logProcessor],
  }).start()

  initialized = true
  return true
}

export async function emitPostHogLog(
  config: PostHogLogConfig,
  severityText: 'INFO' | 'WARN' | 'ERROR',
  body: string,
  attributes: Record<string, string | number | boolean>,
) {
  if (!initializePostHogLogs(config))
    return

  logs.getLogger('posthog-exporter').emit({ severityText, body, attributes })
  await logProcessor?.forceFlush()
}
