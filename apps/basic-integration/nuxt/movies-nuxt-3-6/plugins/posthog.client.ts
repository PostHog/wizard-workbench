import type { PostHog, PostHogConfig, PostHogInterface } from 'posthog-js'
import posthog from 'posthog-js'

import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthog?.publicKey

  if (!token)
    return

  const posthogClient = posthog.init(token, {
    api_host: runtimeConfig.public.posthog.host,
    defaults: runtimeConfig.public.posthog.posthogDefaults,
    capture_pageview: 'history_change',
    __add_tracing_headers: true,
    loaded: (instance: PostHogInterface) => {
      if (import.meta.env.MODE === 'development')
        instance.debug()
    },
  } as Partial<PostHogConfig>)

  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
