import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const posthogKey = config.public.posthogKey
  const posthogHost = config.public.posthogHost

  posthog.init(posthogKey, {
    api_host: posthogHost,
  })

  nuxtApp.vueApp.config.errorHandler = (error) => {
    posthog.captureException(error instanceof Error ? error : new Error(String(error)))
  }

  return {
    provide: {
      posthog: () => posthog,
    },
  }
})
