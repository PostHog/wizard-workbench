import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const posthogClient = posthog.init(runtimeConfig.public.posthogProjectToken, {
    api_host: runtimeConfig.public.posthogHost,
    __add_tracing_headers: true,
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development')
        posthog.debug()
    },
  })

  nuxtApp.hook('vue:error', (error) => {
    posthogClient?.captureException(error instanceof Error ? error : new Error(String(error)))
  })

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
