import { initializePostHogLogger, shutdownPostHogLogger } from '~/server/utils/posthog-logger'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()

  initializePostHogLogger(
    runtimeConfig.public.posthog.projectToken,
    runtimeConfig.public.posthog.host,
  )

  nitroApp.hooks.hook('close', async () => {
    await shutdownPostHogLogger()
  })
})
