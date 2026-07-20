import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  const runtimeConfig = useRuntimeConfig()
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  })

  await posthog.withContext(
    { distinctId: distinctId ?? undefined, sessionId: sessionId ?? undefined },
    async () => {
      posthog.capture({
        distinctId: distinctId ?? 'anonymous',
        event: 'logout_completed',
      })
    },
  )
  await posthog.shutdown()

  return { success: true }
})
