import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let loggerProvider: LoggerProvider | undefined

function getPostHogLogger() {
  if (loggerProvider)
    return loggerProvider.getLogger('posthog-nuxt-integration')

  const config = useRuntimeConfig()
  const projectToken = config.public.posthog?.publicKey
  const host = config.public.posthog?.host

  if (!projectToken) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    return undefined
  }

  if (!host) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    return undefined
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-3-6',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
          },
        }),
      }),
    ],
  })

  return loggerProvider.getLogger('posthog-nuxt-integration')
}

export function emitPostHogIntegrationLog(
  severityText: 'info' | 'warn',
  body: string,
  attributes: Record<string, string>,
) {
  getPostHogLogger()?.emit({ severityText, body, attributes })
}

export async function flushPostHogIntegrationLogs() {
  try {
    await loggerProvider?.forceFlush()
  }
  catch {
    // Log delivery must not change the API route's response.
  }
}
