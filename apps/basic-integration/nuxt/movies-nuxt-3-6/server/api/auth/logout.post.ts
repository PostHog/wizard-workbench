import { getCookie, getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id') ?? getCookie(event, 'auth-analytics-id')
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  })

  if (distinctId) {
    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId },
      async () => {
        posthog.capture({
          event: 'logout_completed',
          distinctId,
        })
      },
    )
    await posthog.shutdown()
  }

  deleteCookie(event, 'auth-user')
  deleteCookie(event, 'auth-analytics-id')
  return { success: true }
})
