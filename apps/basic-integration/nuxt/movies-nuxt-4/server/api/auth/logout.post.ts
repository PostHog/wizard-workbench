import { useServerPostHog } from '../../utils/posthog'

export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = useServerPostHog()
  posthog.capture({
    distinctId: distinctId || 'anonymous',
    event: 'server_logout',
    properties: {
      $session_id: sessionId,
      source: 'api',
    },
  })

  deleteCookie(event, 'auth-user')
  return { success: true }
})
