import type { PostHog } from 'posthog-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host
  const missingVariable = !publicKey
    ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : !host
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : undefined

  if (missingVariable) {
    if (import.meta.dev) {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    tracing_headers: [window.location.hostname],
  }) as PostHog

  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient,
    },
  }
})
