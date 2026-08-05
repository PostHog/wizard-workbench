import type { PostHog, PostHogInterface } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const config = runtimeConfig.public.posthog

  if (!config.publicKey || !config.host) {
    if (import.meta.dev) {
      const variableName = !config.publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'

      throw new Error(`${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(config.publicKey, {
    api_host: config.host,
    defaults: config.posthogDefaults as any,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    loaded: (client: PostHogInterface) => {
      if (import.meta.dev)
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
