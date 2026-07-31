import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!publicKey || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = publicKey
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    loaded: (client: PostHogInterface) => {
      if (import.meta.env.DEV)
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
