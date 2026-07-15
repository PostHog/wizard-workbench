import posthog from 'posthog-js'
import type { PostHog } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const posthogClient = posthog.init(runtimeConfig.public.posthog.publicKey, {
    api_host: runtimeConfig.public.posthog.host,
    capture_pageview: true,
    autocapture: true,
    __add_tracing_headers: true,
    enable_exception_autocapture: true,
  })

  nuxtApp.hook('vue:error', (error) => {
    posthogClient?.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
