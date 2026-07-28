import type { PostHog, PostHogInterface } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import posthog from 'posthog-js'

export default defineNuxtPlugin<{ posthog: PostHog | undefined }>((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!publicKey || !host) {
    const missingVariable = publicKey
      ? 'NUXT_PUBLIC_POSTHOG_HOST'
      : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

    if (import.meta.env.DEV)
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)

    return { provide: { posthog: undefined } }
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    tracing_headers: [window.location.hostname],
    loaded: (client: PostHogInterface) => {
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
