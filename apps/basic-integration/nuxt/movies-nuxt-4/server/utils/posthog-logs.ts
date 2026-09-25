import { SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

export function createPostHogServerLogger() {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey) {
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

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-4-server',
      'deployment.environment': import.meta.dev ? 'development' : 'production',
    }),
    processors: [
      new SimpleLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: { Authorization: `Bearer ${publicKey}` },
        }),
      }),
    ],
  })

  const logger = provider.getLogger('posthog-server')

  return {
    info: (body: string, attributes?: Record<string, string | number | boolean>) => {
      logger.emit({ body, attributes, severityNumber: SeverityNumber.INFO, severityText: 'INFO' })
    },
    shutdown: () => provider.shutdown(),
  }
}
