import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  // Relies on __add_tracing_headers being set in the client-side SDK
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  if (distinctId) {
    const posthog = new PostHog(
      runtimeConfig.public.posthog.publicKey as string,
      { host: runtimeConfig.public.posthog.host as string },
    )

    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId },
      async () => {
        posthog.capture({
          event: 'server_logout',
          distinctId,
        })
      },
    )

    await posthog.shutdown()
  }

  return { success: true }
})
