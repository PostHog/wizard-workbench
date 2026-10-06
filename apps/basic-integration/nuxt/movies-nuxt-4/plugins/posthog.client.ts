import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin<{ posthog: PostHog | undefined }>((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthogToken
  const host = runtimeConfig.public.posthogHost

  if (!token || !host) {
    if (import.meta.dev) {
      const missingVariable = token
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  const posthogClient = posthog.init(token, {
    api_host: host,
    defaults: runtimeConfig.public.posthogDefaults as any,
    tracing_headers: [window.location.hostname],
    logs: {
      serviceName: 'movies-nuxt-web',
      environment: import.meta.env.MODE,
    },
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
