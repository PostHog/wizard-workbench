import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

interface PostHogRuntimeConfig {
  public: {
    posthog: {
      publicKey?: string
      host?: string
    }
  }
}

let sdk: NodeSDK | undefined
let logRecordProcessor: BatchLogRecordProcessor | undefined
let posthogLogger: ReturnType<typeof logs.getLogger> | undefined

function getPostHogLogger(runtimeConfig: PostHogRuntimeConfig) {
  if (posthogLogger)
    return posthogLogger

  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')

    return undefined
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')

    return undefined
  }

  logRecordProcessor = new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: {
        Authorization: `Bearer ${publicKey}`,
      },
    }),
  })
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-server',
      'deployment.environment': process.env.NODE_ENV || 'production',
    }),
    logRecordProcessors: [logRecordProcessor],
  })
  sdk.start()
  posthogLogger = logs.getLogger('posthog-nuxt-movies-server')

  return posthogLogger
}

export async function logPostHogServerEvent(
  runtimeConfig: PostHogRuntimeConfig,
  body: string,
  attributes: Record<string, string | number | boolean> = {},
) {
  const logger = getPostHogLogger(runtimeConfig)
  if (!logger || !logRecordProcessor)
    return

  logger.emit({
    severityText: 'info',
    body,
    attributes,
  })
  await logRecordProcessor.forceFlush()
}
