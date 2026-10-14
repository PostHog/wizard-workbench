import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logProvider: LoggerProvider | undefined
let posthogLogger: Logger | undefined

export function initializePostHogLogs(config: {
  host?: string
  projectToken?: string
}) {
  if (!config.projectToken) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    return
  }

  if (!config.host) {
    if (process.env.NODE_ENV === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    return
  }

  if (logProvider)
    return

  logProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${config.host.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${config.projectToken}`,
          },
        }),
      }),
    ],
  })
  posthogLogger = logProvider.getLogger('posthog-nuxt-movies')
}

export async function logPostHogServerEvent(message: string) {
  posthogLogger?.emit({
    severityText: 'INFO',
    body: message,
  })
  await logProvider?.forceFlush()
}
