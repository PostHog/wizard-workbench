import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { setPostHogLogRecordProcessor } from '../utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthog?.publicKey
  const host = runtimeConfig.public.posthog?.host
  const isDev = process.env.NODE_ENV === 'development'

  if (!projectToken || !host) {
    if (isDev) {
      if (!projectToken)
        console.error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')

      if (!host)
        console.error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }

    return
  }

  const logRecordProcessor = new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: { Authorization: `Bearer ${projectToken}` },
    }),
  })
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-server',
      'deployment.environment': isDev ? 'development' : 'production',
    }),
    logRecordProcessors: [logRecordProcessor],
  })

  sdk.start()
  setPostHogLogRecordProcessor(logRecordProcessor)
  nitroApp.hooks.hookOnce('close', () => sdk.shutdown())
})
