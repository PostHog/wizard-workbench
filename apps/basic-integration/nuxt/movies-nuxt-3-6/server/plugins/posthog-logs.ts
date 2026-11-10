import { initializePostHogLogs, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  initializePostHogLogs()

  nitroApp.hooks.hook('close', () => shutdownPostHogLogs())
})
