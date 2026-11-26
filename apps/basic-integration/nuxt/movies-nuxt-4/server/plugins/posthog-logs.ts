import { shutdownPosthogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hookOnce('close', async () => {
    await Promise.race([
      shutdownPosthogLogs(),
      new Promise(resolve => setTimeout(resolve, 3000)),
    ]).catch(() => {})
  })
})
