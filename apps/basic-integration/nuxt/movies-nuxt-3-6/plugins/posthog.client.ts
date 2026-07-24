import posthog from 'posthog-js'
import type { PostHog } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (process.dev) {
      throw new Error(
        `${!publicKey ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NUXT_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!publicKey ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NUXT_PUBLIC_POSTHOG_HOST'} is configured`,
      )
    }
    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    tracing_headers: [window.location.hostname],
  })

  function captureException(error: unknown) {
    posthogClient?.captureException(error instanceof Error ? error : new Error(String(error)))
  }

  nuxtApp.hook('vue:error', captureException)
  nuxtApp.hook('app:error', captureException)

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
