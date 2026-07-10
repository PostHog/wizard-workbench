import { useServerPostHog } from '~/server/utils/posthog'

export default defineEventHandler(async (event) => {
  const posthog = useServerPostHog()
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const sessionId = getHeader(event, 'x-posthog-session-id')

  deleteCookie(event, 'auth-user')

  if (distinctId) {
    await posthog?.capture({
      distinctId,
      event: 'server_logout_completed',
      properties: {
        $session_id: sessionId,
        logout_state: 'completed',
      },
    })
  }

  return { success: true }
})
