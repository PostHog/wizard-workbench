import { configurePostHogLogs, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const { key, host } = useRuntimeConfig().public.posthog

  configurePostHogLogs(key, host)

  nitroApp.hooks.hook('close', async () => {
    await shutdownPostHogLogs()
  })
})
