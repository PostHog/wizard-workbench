import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    flushAt: 1,
    flushInterval: 0,
  })
  posthog.capture({
    event: 'server_logout',
    distinctId: getCookie(event, 'auth-user') || 'anonymous',
  })
  await posthog.shutdown()
  deleteCookie(event, 'auth-user')
  return { success: true }
})
