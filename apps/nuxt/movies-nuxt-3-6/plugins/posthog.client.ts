import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const client = posthog.init(config.public.posthogPublicKey as string, {
    api_host: config.public.posthogHost as string,
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  })

  const router = useRouter()
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture('$pageview', { current_url: to.fullPath })
    })
  })

  return {
    provide: {
      posthog: () => client,
    },
  }
})
