import process from 'node:process'
import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let initialized = false

function initializePostHogLogs() {
  if (initialized)
    return true

  const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!projectToken) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    }

    return false
  }

  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST
  if (!host) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }

    return false
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-server',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      }),
    ],
  })

  sdk.start()
  initialized = true
  return true
}

const posthogLogger = logs.getLogger('posthog-nuxt-server')

export function emitPostHogLog(message: string) {
  if (!initializePostHogLogs())
    return

  posthogLogger.emit({
    severityText: 'info',
    body: message,
  })
}
