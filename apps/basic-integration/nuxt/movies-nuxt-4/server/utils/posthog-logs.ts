import process from 'node:process'
import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NUXT_PUBLIC_POSTHOG_HOST
const isDevelopment = process.env.NODE_ENV === 'development'

function requiredEnvironmentVariable(name: string) {
  if (isDevelopment) {
    throw new Error(`${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`)
  }
}

if (!projectToken)
  requiredEnvironmentVariable('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN')

if (!host)
  requiredEnvironmentVariable('NUXT_PUBLIC_POSTHOG_HOST')

const loggerProvider = projectToken && host
  ? new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'nuxt-movies-server',
      'deployment.environment': isDevelopment ? 'development' : 'production',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL('/i/v1/logs', host).toString(),
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      }),
    ],
  })
  : undefined

if (loggerProvider)
  logs.setGlobalLoggerProvider(loggerProvider)

const posthogLogger = loggerProvider ? logs.getLogger('posthog-nuxt-server') : undefined

export async function logPosthogServer(
  severityText: 'INFO' | 'WARN' | 'ERROR',
  body: string,
  attributes: Record<string, string | number | boolean>,
) {
  try {
    posthogLogger?.emit({ severityText, body, attributes })
    await loggerProvider?.forceFlush()
  }
  catch {}
}
