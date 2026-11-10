import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

let provider: LoggerProvider | undefined

if (!projectToken || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = projectToken
      ? 'NUXT_PUBLIC_POSTHOG_HOST'
      : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
  }
}
else {
  provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-server',
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, '')}/i/v1/logs`,
          headers: { Authorization: `Bearer ${projectToken}` },
        }),
      }),
    ],
  })
}

export const posthogLogger = provider?.getLogger('movies-nuxt-posthog')

export async function shutdownPostHogLogger() {
  if (!provider)
    return

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<void>((resolve) => {
    timeoutId = setTimeout(resolve, 3000)
  })

  await Promise.race([provider.shutdown(), timeout]).catch(() => {})

  if (timeoutId)
    clearTimeout(timeoutId)
}
