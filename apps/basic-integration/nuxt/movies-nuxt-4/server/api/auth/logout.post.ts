import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const sessionId = getHeader(event, 'x-posthog-session-id')

  if (distinctId) {
    const posthog = useServerPostHog()
    posthog.capture({
      distinctId,
      event: 'server_logout_completed',
      properties: {
        $session_id: sessionId,
        source: 'api',
      },
    })
    await posthog.flush()
  }

  deleteCookie(event, 'auth-user')
  deleteCookie(event, 'auth-user-id')
  return { success: true }
})
