import type { PostHog } from 'posthog-js'
import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp): { provide: { posthog: PostHog | undefined } } => {
  const runtimeConfig = useRuntimeConfig()
  const { key, host } = runtimeConfig.public.posthog

  if (!key || !host) {
    if (import.meta.dev) {
      const variable = !key ? 'NUXT_PUBLIC_POSTHOG_KEY' : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.error(new Error(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`))
    }

    return { provide: { posthog: undefined } }
  }

  const posthogClient = posthog.init(key, {
    api_host: host,
    tracing_headers: [window.location.hostname],
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
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
