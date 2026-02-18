import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  // Relies on __add_tracing_headers being set in the client-side SDK
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = new PostHog(
    runtimeConfig.public.posthogPublicKey,
    {
      host: runtimeConfig.public.posthogHost,
    },
  )

  // Track logout event
  await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    async () => {
      posthog.capture({
        event: 'server_logout',
        distinctId: distinctId ?? 'anonymous',
      })
    },
  )
  await posthog.shutdown()

  deleteCookie(event, 'auth-user')
  return { success: true }
})
