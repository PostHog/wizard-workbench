import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin<{ posthog: PostHog | undefined }>((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!publicKey) {
    if (isDevelopment)
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')

    return { provide: { posthog: undefined } }
  }

  if (!host) {
    if (isDevelopment)
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')

    return { provide: { posthog: undefined } }
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    tracing_headers: [window.location.hostname],
    logs: {
      serviceName: 'movies-nuxt-web',
      environment: isDevelopment ? 'development' : 'production',
    },
    loaded: (client: PostHogInterface) => {
      if (isDevelopment)
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
