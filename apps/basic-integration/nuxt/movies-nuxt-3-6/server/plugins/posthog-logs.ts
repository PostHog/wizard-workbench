import { initializePostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  initializePostHogLogs({
    projectToken: runtimeConfig.public.posthog.publicKey,
    host: runtimeConfig.public.posthog.host,
  })
})
