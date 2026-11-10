import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs'

let posthogLogger: Logger | null | undefined
let loggerProvider: LoggerProvider | undefined
let isShutdownHandlerRegistered = false

function warnForMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    )
  }
}

export function getPostHogLogger(): Logger | null {
  if (posthogLogger !== undefined) return posthogLogger

  const projectToken =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken) {
    warnForMissingConfiguration('VITE_PUBLIC_POSTHOG_PROJECT_TOKEN')
    posthogLogger = null
    return posthogLogger
  }

  if (!host) {
    warnForMissingConfiguration('VITE_PUBLIC_POSTHOG_HOST')
    posthogLogger = null
    return posthogLogger
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'cloudflow-tanstack-start',
    }),
    processors: [
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
  posthogLogger = loggerProvider.getLogger('posthog-invoice-workflow')

  if (!isShutdownHandlerRegistered) {
    isShutdownHandlerRegistered = true
    process.once('beforeExit', () => {
      void loggerProvider?.shutdown().catch(() => {})
    })
  }

  return posthogLogger
}
