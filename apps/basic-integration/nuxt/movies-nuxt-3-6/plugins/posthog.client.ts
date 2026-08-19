import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { projectToken, host, defaults } = runtimeConfig.public.posthog
  const isDev = process.env.NODE_ENV === 'development'

  if (!projectToken || !host) {
    if (isDev) {
      const variable = !projectToken
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
    defaults: defaults as any,
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
