import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

export default defineNitroPlugin((nitroApp) => {
  const { publicKey, host } = useRuntimeConfig().public.posthog

  if (!publicKey) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    return
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    return
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${publicKey}`,
          },
        }),
      }),
    ],
  })

  sdk.start()
  nitroApp.hooks.hookOnce('close', async () => {
    await sdk.shutdown()
  })
})
