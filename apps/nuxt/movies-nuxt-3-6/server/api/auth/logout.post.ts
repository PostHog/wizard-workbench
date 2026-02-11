import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

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

  posthog.capture({
    event: 'server_logout',
    distinctId: distinctId ?? 'anonymous',
    properties: {
      $session_id: sessionId,
    },
  })
  await posthog.shutdown()

  deleteCookie(event, 'auth-user')
  return { success: true }
})
