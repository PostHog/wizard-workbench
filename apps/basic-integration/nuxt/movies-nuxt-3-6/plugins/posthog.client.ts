import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!publicKey || !host) {
    if (process.dev) {
      throw new Error(
        'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NUXT_PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once the variables are configured',
      )
    }
    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    tracing_headers: [window.location.hostname],
    loaded: (client: PostHogInterface) => {
      if (process.dev)
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
