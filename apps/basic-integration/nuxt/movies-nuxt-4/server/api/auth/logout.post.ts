import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const posthog = useServerPostHog()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const currentUser = getCookie(event, 'auth-user')
  const distinctId = getHeader(event, 'x-posthog-distinct-id') || currentUser || crypto.randomUUID()

  try {
    deleteCookie(event, 'auth-user')

    posthog.capture({
      distinctId,
      event: 'auth_logout_api_succeeded',
      properties: {
        $session_id: sessionId,
        had_cookie_session: Boolean(currentUser),
      },
    })
    await posthog.flush()

    return { success: true }
  }
  catch (error) {
    posthog.captureException(error, distinctId, {
      $session_id: sessionId,
      endpoint: '/api/auth/logout',
    })
    await posthog.flush()
    throw error
  }
})
