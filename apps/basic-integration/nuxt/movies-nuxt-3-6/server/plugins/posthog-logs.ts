import { initializePostHogLogs, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  initializePostHogLogs(runtimeConfig.public.posthog)

  nitroApp.hooks.hook('close', () => shutdownPostHogLogs())
})
