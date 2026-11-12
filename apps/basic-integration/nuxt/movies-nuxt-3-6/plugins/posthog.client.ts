import posthog, { type PostHog } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host
  const isDev = process.env.NODE_ENV === 'development'
  const missingVariable = !publicKey
    ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : !host
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : undefined
  let posthogClient: PostHog | undefined

  if (missingVariable) {
    if (isDev)
      console.error(new Error(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`))
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
        environment: isDev ? 'development' : 'production',
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
