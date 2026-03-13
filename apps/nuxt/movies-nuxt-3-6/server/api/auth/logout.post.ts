import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = new PostHog(
    runtimeConfig.public.posthog.publicKey,
    { host: runtimeConfig.public.posthog.host },
  )
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

  return { success: true }
})
