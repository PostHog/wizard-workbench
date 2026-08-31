import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host, posthogDefaults } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (process.env.NODE_ENV === 'development') {
      const variable = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      )
    }

    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    defaults: posthogDefaults as any,
    tracing_headers: [window.location.hostname],
    loaded: (client: PostHogInterface) => {
      if (process.env.NODE_ENV === 'development')
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
