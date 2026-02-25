import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  // Server-side PostHog tracking
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = new PostHog(
    runtimeConfig.public.posthog.publicKey as string,
    { host: runtimeConfig.public.posthog.host as string },
  )

  await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    async () => {
      posthog.capture({
        event: 'server_user_logged_out',
        distinctId: distinctId ?? 'anonymous',
      })
    },
  )

  await posthog.shutdown()

  return { success: true }
})
