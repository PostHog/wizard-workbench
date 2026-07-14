import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthogClient = new PostHog(
    runtimeConfig.public.posthog.publicKey,
    { host: runtimeConfig.public.posthog.host },
  )

  await posthogClient.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    async () => {
      posthogClient.capture({
        event: 'server_logout',
        distinctId: distinctId ?? 'anonymous',
      })
    },
  )

  await posthogClient.shutdown()

  return { success: true }
})
