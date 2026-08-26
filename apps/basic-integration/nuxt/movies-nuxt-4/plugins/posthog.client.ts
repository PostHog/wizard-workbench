import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (import.meta.dev) {
      const missingVariable = !publicKey ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    loaded: (client) => {
      if (import.meta.dev)
        client.debug()
    },
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
