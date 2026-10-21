import process from 'node:process'
import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { NodeSDK } from '@opentelemetry/sdk-node'

let isInitialized = false

function getPostHogLogger() {
  const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = projectToken ? 'NUXT_PUBLIC_POSTHOG_HOST' : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return
  }

  if (!isInitialized) {
    const exporter = new OTLPLogExporter({
      url: new URL('/i/v1/logs', host).toString(),
      headers: {
        Authorization: `Bearer ${projectToken}`,
      },
    })

    new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'movies-nuxt',
        'deployment.environment': process.env.NODE_ENV ?? 'development',
      }),
      logRecordProcessors: [new BatchLogRecordProcessor({ exporter })],
    }).start()

    isInitialized = true
  }

  return logs.getLogger('movies-nuxt-posthog')
}

export function logPostHogAuthOutcome(event: 'auth.login.completed' | 'auth.logout.completed') {
  getPostHogLogger()?.emit({
    severityText: 'INFO',
    body: 'Authentication request completed',
    attributes: {
      event,
      outcome: 'success',
    },
  })
}
