import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  // Server-side PostHog tracking
  const runtimeConfig = useRuntimeConfig()
  // Relies on __add_tracing_headers being set in the client-side SDK
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  if (distinctId) {
    const posthog = new PostHog(
      runtimeConfig.public.posthog.publicKey,
      { host: runtimeConfig.public.posthog.host },
    )

    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId },
      async () => {
        posthog.capture({
          event: 'server_logout_completed',
          distinctId,
        })
      },
    )

    // Always shutdown to ensure all events are flushed
    await posthog.shutdown()
  }

  return { success: true }
})
