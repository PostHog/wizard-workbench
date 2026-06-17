import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  if (distinctId) {
    const posthog = new PostHog(runtimeConfig.public.posthogProjectToken, {
      host: runtimeConfig.public.posthogHost,
    })

    posthog.capture({
      event: 'server_user_logged_out',
      distinctId,
      properties: {
        $session_id: sessionId ?? undefined,
      },
    })

    await posthog.shutdown()
  }

  return { success: true }
})
