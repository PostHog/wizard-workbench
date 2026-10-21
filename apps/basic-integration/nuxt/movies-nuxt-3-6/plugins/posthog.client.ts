import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin<{ posthog: PostHog | undefined }>((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { projectToken, host } = runtimeConfig.public.posthog
  const isDev = import.meta.env.MODE === 'development'

  if (!projectToken || !host) {
    if (isDev) {
      const missingVariable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return {
      provide: {
        posthog: undefined,
      },
    }
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
    capture_exceptions: true,
    logs: {
      serviceName: 'movies-nuxt-web',
      environment: isDev ? 'development' : 'production',
    },
    tracing_headers: [window.location.hostname],
    loaded: (client: PostHogInterface) => {
      if (isDev)
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
