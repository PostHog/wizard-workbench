import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  if (distinctId) {
    const posthog = useServerPostHog()
    posthog.capture({
      distinctId,
      event: 'server_user_logged_out',
      properties: {
        $session_id: sessionId,
      },
    })
  }

  deleteCookie(event, 'auth-user')
  return { success: true }
})
