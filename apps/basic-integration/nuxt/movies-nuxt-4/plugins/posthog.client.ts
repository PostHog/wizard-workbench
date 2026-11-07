import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin<{ posthog: PostHog | undefined }>((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (import.meta.dev) {
      if (!publicKey) {
        console.error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
      }

      if (!host) {
        console.error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
      }
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    logs: {
      serviceName: 'movies-nuxt-4-web',
      environment: import.meta.dev ? 'development' : 'production',
    },
  })

  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient,
    },
  }
})
