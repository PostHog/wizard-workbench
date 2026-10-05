import process from 'node:process'
import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

interface PostHogLogConfig {
  projectToken?: string
  host?: string
}

let sdk: NodeSDK | undefined

export function getPostHogLogger({ projectToken, host }: PostHogLogConfig) {
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

  if (!sdk) {
    sdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'nuxt-movies-nitro',
        'deployment.environment': process.env.NODE_ENV ?? 'production',
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${projectToken}` },
          }),
        }),
      ],
    })
    sdk.start()
  }

  return logs.getLogger('posthog-nuxt-movies')
}
