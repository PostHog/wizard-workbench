import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { projectToken, host } = runtimeConfig.public.posthog

  if (!projectToken || !host) {
    if (import.meta.env.MODE === 'development') {
      const missingVariable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
    logs: {
      serviceName: 'movies-nuxt-web',
      environment: import.meta.env.MODE,
    },
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
