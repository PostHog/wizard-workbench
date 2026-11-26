import { shutdownPosthogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    await shutdownPosthogLogs()
  })
})
