import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  deleteCookie(event, 'auth-user')

  if (distinctId) {
    const posthog = useServerPostHog()
    posthog.capture({
      distinctId,
      event: 'server_logout',
      properties: {
        $session_id: sessionId,
      },
    })
  }

  return { success: true }
})
