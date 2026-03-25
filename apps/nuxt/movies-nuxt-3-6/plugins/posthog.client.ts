import posthog from 'posthog-js'

export default defineNuxtPlugin((_nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (ph) => {
      if (import.meta.env.DEV)
        ph.debug()
    },
  })

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
