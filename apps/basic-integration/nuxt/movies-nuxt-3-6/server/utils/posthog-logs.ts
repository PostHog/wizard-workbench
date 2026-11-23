import { PostHog } from 'posthog-node'

interface PostHogLogConfig {
  publicKey?: string
  host?: string
}

let warnedAboutMissingToken = false
let warnedAboutMissingHost = false

export async function capturePostHogLog(
  config: PostHogLogConfig,
  message: string,
  attributes: Record<string, string | number | boolean>,
) {
  if (!config.publicKey || !config.host) {
    if (process.env.NODE_ENV !== 'production') {
      if (!config.publicKey && !warnedAboutMissingToken) {
        warnedAboutMissingToken = true
        console.warn('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
      }
      if (!config.host && !warnedAboutMissingHost) {
        warnedAboutMissingHost = true
        console.warn('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
      }
    }
    return
  }

  const posthog = new PostHog(config.publicKey, {
    host: config.host,
    logs: { serviceName: 'nuxt-movies' },
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0,
  })

  posthog.logger.info(message, attributes)
  await posthog.shutdown(2000).catch(() => {})
}
