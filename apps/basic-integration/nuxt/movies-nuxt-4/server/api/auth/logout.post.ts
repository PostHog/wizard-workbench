import { getCookie, getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const username = getCookie(event, 'auth-user')
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  deleteCookie(event, 'auth-user')

  const resolvedDistinctId = distinctId ?? username
  if (resolvedDistinctId) {
    const posthog = new PostHog(
      runtimeConfig.public.posthog.publicKey,
      { host: runtimeConfig.public.posthog.host },
    )

    posthog.capture({
      event: 'server_user_logged_out',
      distinctId: resolvedDistinctId,
      properties: {
        $session_id: sessionId ?? undefined,
      },
    })

    await posthog.shutdown()
  }

  return { success: true }
})
