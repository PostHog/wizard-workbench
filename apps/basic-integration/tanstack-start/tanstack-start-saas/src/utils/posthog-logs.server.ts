import { logs, type Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let logger: Logger | undefined

function getPostHogConfiguration() {
  const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !projectToken
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return undefined
  }

  return { projectToken, host }
}

export function getPostHogLogger(): Logger | undefined {
  if (logger) return logger

  const configuration = getPostHogConfiguration()
  if (!configuration) return undefined

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'cloudflow-tanstack-start',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', configuration.host).toString(),
          headers: {
            Authorization: `Bearer ${configuration.projectToken}`,
          },
        }),
      }),
    ],
  })

  sdk.start()
  logger = logs.getLogger('posthog-invoice-lifecycle')
  return logger
}
