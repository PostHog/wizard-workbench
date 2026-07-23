import type { PostHog, PostHogInterface } from 'posthog-js'
import posthog from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!token) {
    if (import.meta.env.MODE === 'development')
      console.error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    return { provide: { posthog: undefined as unknown as PostHog } }
  }

  const posthogClient = posthog.init(token, {
    api_host: host,
    defaults: runtimeConfig.public.posthog.posthogDefaults as any,
    tracing_headers: [window.location.hostname],
    loaded: (posthog: PostHogInterface) => {
      if (import.meta.env.MODE === 'development')
        posthog.debug()
    },
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
