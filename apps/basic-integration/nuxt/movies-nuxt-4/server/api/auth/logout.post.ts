import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const posthog = useServerPostHog()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id') || 'anonymous'

  deleteCookie(event, 'auth-user')

  posthog.capture({
    distinctId,
    event: 'server_logout_completed',
    properties: {
      $session_id: sessionId,
      source: 'api',
    },
  })
  await posthog.flush()

  return { success: true }
})
