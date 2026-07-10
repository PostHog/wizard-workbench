import type { PostHog, PostHogInterface } from 'posthog-js'
import posthog from 'posthog-js'
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey

  if (!publicKey) {
    return {
      provide: {
        posthog: null,
      },
    }
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: runtimeConfig.public.posthog.host,
    defaults: runtimeConfig.public.posthog.posthogDefaults,
    capture_pageview: 'history_change',
    __add_tracing_headers: true,
    loaded: (instance: PostHogInterface) => {
      if (import.meta.env.MODE === 'development')
        instance.debug()

      const currentUser = useCookie<string | null>('auth-user').value
      if (currentUser)
        instance.identify(currentUser)
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
