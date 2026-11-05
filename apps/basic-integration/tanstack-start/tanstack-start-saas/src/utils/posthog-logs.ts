import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let posthogLogSdk: NodeSDK | undefined
let posthogLogger: ReturnType<typeof logs.getLogger> | undefined

export function getPostHogLogger() {
  if (posthogLogger) return posthogLogger

  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token) {
    if (import.meta.env.DEV) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
      )
    }
    return undefined
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
      )
    }
    return undefined
  }

  posthogLogSdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-example-basic',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      }),
    ],
  })
  posthogLogSdk.start()

  posthogLogger = logs.getLogger('posthog-integration')
  return posthogLogger
}
