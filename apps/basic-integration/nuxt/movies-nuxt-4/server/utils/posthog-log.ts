import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributes = Record<string, boolean | number | string>

export async function emitPostHogLog(body: string, attributes: LogAttributes) {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthogToken
  const host = runtimeConfig.public.posthogHost

  if (!token || !host) {
    if (import.meta.dev) {
      const missingVariable = token
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return
  }

  const exporter = new OTLPLogExporter({
    url: `${host.replace(/\/$/, '')}/i/v1/logs`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt-server',
      'deployment.environment': process.env.NODE_ENV ?? 'development',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  })

  loggerProvider.getLogger('posthog-integration').emit({
    severityText: 'info',
    body,
    attributes,
  })

  try {
    await loggerProvider.forceFlush()
  }
  catch {
    // Log delivery must not interrupt the authentication request.
  }
  finally {
    try {
      await loggerProvider.shutdown()
    }
    catch {
      // Log delivery must not interrupt the authentication request.
    }
  }
}
