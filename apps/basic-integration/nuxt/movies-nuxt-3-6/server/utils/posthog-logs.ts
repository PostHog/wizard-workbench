import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

let logger: ReturnType<typeof logs.getLogger> | undefined
let sdk: NodeSDK | undefined
let logRecordProcessor: BatchLogRecordProcessor | undefined
let initializationAttempted = false

function getPostHogLogger() {
  if (initializationAttempted)
    return logger

  initializationAttempted = true

  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (process.dev) {
      const missingVariable = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return undefined
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${publicKey}`,
    },
  })

  logRecordProcessor = new BatchLogRecordProcessor({ exporter })
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-api',
    }),
    logRecordProcessors: [logRecordProcessor],
  })

  sdk.start()
  logger = logs.getLogger('posthog-nuxt-movies')

  return logger
}

export async function emitPostHogLog(body: string) {
  const posthogLogger = getPostHogLogger()
  if (!posthogLogger || !logRecordProcessor)
    return

  posthogLogger.emit({ severityText: 'info', body })

  try {
    await logRecordProcessor.forceFlush()
  }
  catch (error) {
    if (process.dev)
      console.error('Failed to flush PostHog log', error)
  }
}
