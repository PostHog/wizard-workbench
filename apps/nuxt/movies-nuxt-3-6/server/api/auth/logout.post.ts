import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
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
          event: 'server_logout',
          distinctId,
        })
      },
    )

    await posthog.shutdown()
  }

  deleteCookie(event, 'auth-user')
  return { success: true }
})
