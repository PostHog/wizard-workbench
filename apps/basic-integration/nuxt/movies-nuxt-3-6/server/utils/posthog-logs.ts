import { type Logger, logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

let posthogLogsSdk: NodeSDK | undefined
let posthogLogsProcessor: BatchLogRecordProcessor | undefined
let posthogLogger: Logger | undefined
let posthogLogsDisabled = false

function missingConfiguration(variableName: string): void {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    )
  }
}

function getPostHogLogger(): Logger | undefined {
  if (posthogLogger || posthogLogsDisabled)
    return posthogLogger

  const config = useRuntimeConfig()
  const { publicKey, host } = config.public.posthog

  if (!publicKey) {
    missingConfiguration('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN')
    posthogLogsDisabled = true
    return undefined
  }

  if (!host) {
    missingConfiguration('NUXT_PUBLIC_POSTHOG_HOST')
    posthogLogsDisabled = true
    return undefined
  }

  posthogLogsProcessor = new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter({
      url: `${host.replace(/\/$/, '')}/i/v1/logs`,
      headers: {
        Authorization: `Bearer ${publicKey}`,
      },
    }),
  })
  posthogLogsSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-3-6',
    }),
    logRecordProcessors: [posthogLogsProcessor],
  })
  posthogLogsSdk.start()
  posthogLogger = logs.getLogger('posthog-movies-api')

  return posthogLogger
}

export async function logPostHogAuthEvent(eventName: 'login_succeeded' | 'logout_succeeded'): Promise<void> {
  const logger = getPostHogLogger()
  if (!logger)
    return

  logger.emit({
    severityText: 'INFO',
    body: `Authentication ${eventName.replace('_', ' ')}`,
    attributes: {
      'event.name': `auth.${eventName}`,
    },
  })

  await posthogLogsProcessor?.forceFlush()
}
