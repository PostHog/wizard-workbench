import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthog?.publicKey
  const host = runtimeConfig.public.posthog?.host
  const isDev = process.env.NODE_ENV === 'development'

  if (!projectToken || !host) {
    if (isDev) {
      if (!projectToken)
        console.error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')

      if (!host)
        console.error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }

    return
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
    logs: {
      serviceName: 'nuxt-movies-web',
      environment: isDev ? 'development' : 'production',
    },
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
