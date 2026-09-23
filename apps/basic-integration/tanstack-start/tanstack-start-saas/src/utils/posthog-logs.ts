import { logs, type Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let logger: Logger | undefined
let logRecordProcessor: BatchLogRecordProcessor | undefined
let sdk: NodeSDK | undefined

export function getPostHogLogger(): Logger | undefined {
  if (logger) return logger

  const projectToken =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ||
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = projectToken
        ? 'VITE_PUBLIC_POSTHOG_HOST'
        : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
    return undefined
  }

  logRecordProcessor = new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: {
        Authorization: `Bearer ${projectToken}`,
      },
    }),
  })

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-invoice-service',
    }),
    logRecordProcessors: [logRecordProcessor],
  })
  sdk.start()

  logger = logs.getLogger('posthog-invoice-operations')
  return logger
}

export async function flushPostHogLogs() {
  await logRecordProcessor?.forceFlush()
}
