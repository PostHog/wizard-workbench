import type { PostHog, PostHogInterface } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  let posthogClient: PostHog | undefined

  if (!publicKey || !host) {
    if (import.meta.dev) {
      const missingVariable = publicKey
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'

      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
  }
  else {
    posthogClient = posthog.init(publicKey, {
      api_host: host,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      logs: {
        serviceName: 'movies-nuxt-web',
        environment: import.meta.dev ? 'development' : 'production',
      },
      loaded: (client: PostHogInterface) => {
        if (import.meta.dev)
          client.debug()
      },
    })

    nuxtApp.hook('vue:error', (error) => {
      posthogClient?.captureException(error)
    })
  }

  return {
    provide: {
      posthog: posthogClient,
    },
  }
})
