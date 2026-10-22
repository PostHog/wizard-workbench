import posthog from 'posthog-js'
import type { PostHog, PostHogInterface } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  if (!publicKey || !host) {
    if (process.dev) {
      const missingVariable = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'
      throw new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }

    return
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: 'movies-nuxt-web',
      environment: process.dev ? 'development' : 'production',
    },
    loaded: (posthog: PostHogInterface) => {
      if (process.dev)
        posthog.debug()
    },
  })

  const authenticatedUser = useCookie<string | null>('auth-user').value
  if (authenticatedUser)
    posthogClient.identify(authenticatedUser)

  nuxtApp.hook('vue:error', (error) => {
    posthogClient.captureException(error)
  })

  return {
    provide: {
      posthog: posthogClient as PostHog,
    },
  }
})
