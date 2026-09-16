import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthogProjectToken
  const host = runtimeConfig.public.posthogHost

  if (!projectToken || !host) {
    if (import.meta.dev) {
      const missingVariable = projectToken
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
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
