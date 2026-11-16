import { getPostHogLogger, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  getPostHogLogger()

  nitroApp.hooks.hookOnce('close', async () => {
    await shutdownPostHogLogs()
  })
})
