import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#imports'
import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const posthogClient = posthog.init(runtimeConfig.public.posthogKey, {
    api_host: runtimeConfig.public.posthogHost,
    person_profiles: 'identified_only',
    capture_pageview: false, // we manually capture pageviews
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })

  // Capture pageviews on route change
  const router = useRouter()
  router.afterEach((to) => {
    posthog.capture('$pageview', { current_url: to.fullPath })
  })

  return {
    provide: {
      posthog: () => posthogClient,
    },
  }
})
