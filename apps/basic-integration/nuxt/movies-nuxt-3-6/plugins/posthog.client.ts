import type { PostHog, PostHogInterface } from 'posthog-js'
import posthog from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const posthogClient = posthog.init(runtimeConfig.public.posthog.publicKey, {
    api_host: runtimeConfig.public.posthog.host,
    defaults: runtimeConfig.public.posthog.posthogDefaults as '2026-05-30',
    capture_pageview: 'history_change',
    __add_tracing_headers: [runtimeConfig.public.posthog.host],
    loaded: (client: PostHogInterface) => {
      if (import.meta.env.MODE === 'development')
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
