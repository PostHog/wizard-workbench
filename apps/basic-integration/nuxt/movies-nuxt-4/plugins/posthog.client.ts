import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const { public: publicConfig } = useRuntimeConfig()
  const { projectToken, host } = publicConfig.posthog

  if (!projectToken) {
    if (import.meta.dev) {
      throw new Error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
    }
    return
  }

  if (!host) {
    if (import.meta.dev) {
      throw new Error('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')
    }
    return
  }

  const posthogClient = posthog.init(projectToken, {
    api_host: host,
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
