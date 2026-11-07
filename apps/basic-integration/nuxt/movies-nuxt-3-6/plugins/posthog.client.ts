import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingKey = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${missingKey} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingKey} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    // Keep server-side events and errors in the same browser session after identify().
    tracing_headers: [window.location.hostname],
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: 'nuxt-movies-web',
      environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    },
    loaded: (client: PostHogInterface) => {
      if (process.env.NODE_ENV === 'development')
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
