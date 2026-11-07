import { initializePostHogLogs, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const { public: { posthog } } = useRuntimeConfig()
  initializePostHogLogs(posthog.publicKey, posthog.host)

  nitroApp.hooks.hookOnce('close', async () => {
    await shutdownPostHogLogs()
  })
})
