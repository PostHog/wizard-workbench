import { getPostHogLogLogger, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  getPostHogLogLogger()

  nitroApp.hooks.hookOnce('close', async () => {
    await shutdownPostHogLogs()
  })
})
