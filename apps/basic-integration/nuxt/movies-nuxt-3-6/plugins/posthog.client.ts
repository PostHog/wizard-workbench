import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!publicKey) {
    if (isDevelopment) {
      throw new Error(
        'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
      )
    }
    return
  }

  if (!host) {
    if (isDevelopment) {
      throw new Error(
        'NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured',
      )
    }
    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    tracing_headers: [window.location.hostname],
    loaded: (client: PostHogInterface) => {
      if (isDevelopment)
        client.debug()
    },
  })

  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  nuxtApp.hook('app:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
