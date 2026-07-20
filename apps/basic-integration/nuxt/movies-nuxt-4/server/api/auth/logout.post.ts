import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const distinctId = getHeader(event, 'x-posthog-distinct-id') || getCookie(event, 'auth-user')
  const posthog = useServerPostHog()

  if (distinctId) {
    posthog.capture({
      distinctId,
      event: 'server_user_logged_out',
      properties: {
        $session_id: getHeader(event, 'x-posthog-session-id'),
      },
    })
    await posthog.flush()
  }

  deleteCookie(event, 'auth-user')
  return { success: true }
})
