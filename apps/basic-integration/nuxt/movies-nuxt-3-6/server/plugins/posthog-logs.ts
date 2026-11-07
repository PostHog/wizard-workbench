import { initializePostHogLogs, shutdownPostHogLogs } from '../utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const { public: publicConfig } = useRuntimeConfig()

  initializePostHogLogs(publicConfig.posthog)

  nitroApp.hooks.hook('close', async () => {
    await shutdownPostHogLogs()
  })
})
