import { initializePostHogLogs, shutdownPostHogLogs } from '../utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog

  initializePostHogLogs(publicKey, host)

  nitroApp.hooks.hookOnce('close', () => shutdownPostHogLogs())
})
