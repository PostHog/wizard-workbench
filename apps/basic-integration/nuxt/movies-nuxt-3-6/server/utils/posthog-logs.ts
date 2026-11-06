import { type Logger, SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

interface PostHogLogger {
  emit: (body: string, attributes: Record<string, string>) => void
  shutdown: () => Promise<void>
}

export function createPostHogLogger(): PostHogLogger | undefined {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const variable = !token ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.warn(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`)
    }
    return
  }

  try {
    const provider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'movies-nuxt',
      }),
      processors: [
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
    const logger: Logger = provider.getLogger('posthog-app-log')

    return {
      emit(body, attributes) {
        logger.emit({
          severityNumber: SeverityNumber.INFO,
          severityText: 'INFO',
          body,
          attributes,
        })
      },
      async shutdown() {
        let timeoutId: ReturnType<typeof setTimeout>
        const timeout = new Promise<void>((resolve) => {
          timeoutId = setTimeout(resolve, 2000)
        })
        try {
          await Promise.race([provider.shutdown(), timeout]).catch(() => {})
        }
        finally {
          clearTimeout(timeoutId!)
        }
      },
    }
  }
  catch {
    // Telemetry setup is optional and must not affect the application response.
  }
}
