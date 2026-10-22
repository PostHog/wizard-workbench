import type { PostHog } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import posthog from 'posthog-js'

export default defineNuxtPlugin<{ posthog: PostHog | undefined }>((nuxtApp) => {
  const posthogConfig = useRuntimeConfig().public.posthog

  if (!posthogConfig.publicKey) {
    if (import.meta.dev) {
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  if (!posthogConfig.host) {
    if (import.meta.dev) {
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  const posthogClient = posthog.init(posthogConfig.publicKey, {
    api_host: posthogConfig.host,
    defaults: '2025-05-24',
    capture_exceptions: true,
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
