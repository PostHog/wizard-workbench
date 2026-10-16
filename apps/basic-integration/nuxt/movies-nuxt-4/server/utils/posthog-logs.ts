import process from 'node:process'
import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let initialized = false
let logRecordProcessor: BatchLogRecordProcessor | undefined

function getPostHogLogLogger() {
  if (!initialized) {
    const runtimeConfig = useRuntimeConfig()
    const projectToken = runtimeConfig.public.posthog.publicKey
    const host = runtimeConfig.public.posthog.host

    if (!projectToken) {
      if (import.meta.dev) {
        throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
      }
      return
    }

    if (!host) {
      if (import.meta.dev) {
        throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
      }
      return
    }

    initialized = true
    logRecordProcessor = new BatchLogRecordProcessor({
      exporter: new OTLPLogExporter({
        url: new URL('/i/v1/logs', host).toString(),
        headers: {
          Authorization: `Bearer ${projectToken}`,
        },
      }),
    })

    new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'movies-nuxt-server',
        'deployment.environment': process.env.NODE_ENV ?? 'development',
      }),
      logRecordProcessors: [logRecordProcessor],
    }).start()
  }

  return logs.getLogger('posthog-integration')
}

export function logPostHogServerInfo(message: string, attributes: Record<string, string>) {
  getPostHogLogLogger()?.emit({
    severityText: 'info',
    body: message,
    attributes,
  })
}

export async function flushPostHogServerLogs() {
  await logRecordProcessor?.forceFlush()
}
