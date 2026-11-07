import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const token = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

let loggerProvider: LoggerProvider | undefined

if (token && host) {
  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-server',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${token}` },
          timeoutMillis: 2000,
        }),
      }),
    ],
  })
}
else if (process.env.NODE_ENV !== 'production') {
  const missingVariable = !token
    ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'NUXT_PUBLIC_POSTHOG_HOST'

  console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
}

export const posthogServerLogger = loggerProvider?.getLogger('nuxt-movies-server-posthog')

export const shutdownPostHogLogCapture = () => loggerProvider?.shutdown().catch(() => {})
