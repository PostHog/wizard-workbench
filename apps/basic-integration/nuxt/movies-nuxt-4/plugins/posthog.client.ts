import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { ConfigDefaults } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!token) {
    if (import.meta.env.MODE === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    return
  }

  if (!host) {
    if (import.meta.env.MODE === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    return
  }

  const posthogClient = posthog.init(token, {
    api_host: host,
    defaults: runtimeConfig.public.posthog.posthogDefaults as ConfigDefaults,
    capture_exceptions: true,
    tracing_headers: [window.location.hostname],
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
