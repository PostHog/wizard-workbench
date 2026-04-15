import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const posthogClient = posthog.init(config.public.posthog.projectToken, {
    api_host: config.public.posthog.apiHost,
    capture_pageview: false, // Disable automatic pageviews; we track meaningful actions manually
    loaded: (posthog) => {
      if (import.meta.dev)
        posthog.debug()
    },
  })

  // Track route changes as pageviews
  const router = useRouter()
  router.afterEach((to) => {
    posthog.capture('$pageview', { current_url: to.fullPath })
  })

  return {
    provide: {
      posthog: posthogClient,
    },
  }
})
