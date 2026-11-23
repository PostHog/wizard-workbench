import { configurePostHogLogs, shutdownPostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  const { public: { posthog } } = useRuntimeConfig()

  configurePostHogLogs(posthog.publicKey, posthog.host)

  nitroApp.hooks.hookOnce('close', () => shutdownPostHogLogs())
})
