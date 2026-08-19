import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!publicKey) {
    if (import.meta.dev) {
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  if (!host) {
    if (import.meta.dev) {
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
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
