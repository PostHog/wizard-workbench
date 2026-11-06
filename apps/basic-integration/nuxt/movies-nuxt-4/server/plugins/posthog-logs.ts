import process from 'node:process'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { emitPostHogLog, setPostHogLogger } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthogProjectToken
  const host = runtimeConfig.public.posthogHost

  if (!projectToken) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    }
    return
  }

  if (!host) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }
    return
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'movies-nuxt',
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

  setPostHogLogger(provider.getLogger('posthog-nuxt-log-exporter'))
  emitPostHogLog('PostHog log capture configured', { log_source: 'posthog_nuxt_exporter' })

  nitroApp.hooks.hook('close', async () => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    try {
      await Promise.race([
        provider.shutdown(),
        new Promise<void>((resolve) => {
          timeout = setTimeout(resolve, 3000)
        }),
      ])
    }
    catch {
      // Log delivery must not block application shutdown.
    }
    finally {
      if (timeout)
        clearTimeout(timeout)
    }
  })
})
