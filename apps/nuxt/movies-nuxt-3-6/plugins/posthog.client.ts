import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const posthogClient = posthog.init(runtimeConfig.public.posthog.publicKey as string, {
    api_host: runtimeConfig.public.posthog.host as string,
    person_profiles: 'identified_only',
    capture_pageview: false,
  })

  return {
    provide: {
      posthog: posthogClient,
    },
  }
})
