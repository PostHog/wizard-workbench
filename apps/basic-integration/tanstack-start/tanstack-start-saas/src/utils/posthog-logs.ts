import type { Logger } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

let logger: Logger | null | undefined
let missingConfigurationWarningLogged = false

function warnAboutMissingConfiguration(token?: string, host?: string) {
  if (import.meta.env.PROD || missingConfigurationWarningLogged) return

  const missingVariable = !token
    ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : !host
      ? 'VITE_PUBLIC_POSTHOG_HOST'
      : null

  if (!missingVariable) return

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
  missingConfigurationWarningLogged = true
}

export function getPostHogLogLogger(): Logger | null {
  if (logger !== undefined) return logger

  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST || import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    warnAboutMissingConfiguration(token, host)
    logger = null
    return logger
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'tanstack-start-saas',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeoutMillis: 2000,
        }),
      }),
    ],
  })

  process.once('beforeExit', () => {
    void provider.shutdown().catch(() => {})
  })

  logger = provider.getLogger('posthog-integration')
  return logger
}
