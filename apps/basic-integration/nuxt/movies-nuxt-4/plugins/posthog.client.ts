import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const key = runtimeConfig.public.posthog.key
  const host = runtimeConfig.public.posthog.host

  if (!key || !host) {
    if (import.meta.dev) {
      const variable = key ? 'NUXT_PUBLIC_POSTHOG_HOST' : 'NUXT_PUBLIC_POSTHOG_KEY'
      throw new Error(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(key, {
    api_host: host,
  })

  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
