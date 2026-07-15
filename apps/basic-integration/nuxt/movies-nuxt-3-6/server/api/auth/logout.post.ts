import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    flushAt: 1,
    flushInterval: 0,
  })

  await posthog.withContext({ sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined }, async () => {
    posthog.capture({
      event: 'logout_succeeded',
      distinctId: distinctId ?? 'anonymous',
    })
  })
  await posthog.shutdown()

  deleteCookie(event, 'auth-user')
  return { success: true }
})
