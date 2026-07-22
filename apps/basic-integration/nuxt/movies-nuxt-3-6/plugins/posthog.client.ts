import posthog from 'posthog-js'
import type { PostHog } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin<{ posthog?: PostHog }>((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!projectToken) {
    if (import.meta.env.MODE === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    return { provide: { posthog: undefined } }
  }

  if (!host) {
    if (import.meta.env.MODE === 'development')
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    return { provide: { posthog: undefined } }
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
    defaults: '2025-05-24',
    loaded: (client: PostHog) => {
      if (import.meta.env.MODE === 'development')
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
