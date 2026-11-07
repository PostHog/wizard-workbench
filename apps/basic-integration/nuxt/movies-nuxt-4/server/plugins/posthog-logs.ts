import process from 'node:process'
import {
  initializePostHogLogs,
  shutdownPostHogLogs,
} from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const projectToken = config.public.posthog?.publicKey
  const host = config.public.posthog?.host

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = projectToken
        ? 'NUXT_PUBLIC_POSTHOG_HOST'
        : 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      console.warn(`${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`)
    }
    return
  }

  if (!initializePostHogLogs(projectToken, host) && process.env.NODE_ENV !== 'production') {
    console.warn('PostHog log capture could not be initialized')
    return
  }

  nitroApp.hooks.hook('close', () => shutdownPostHogLogs())
})
