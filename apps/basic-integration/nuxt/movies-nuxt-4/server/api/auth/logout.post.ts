import { useServerPostHog } from '~/server/utils/posthog'
import { getPostHogDistinctId } from '~/utils/posthog'

export default defineEventHandler(async (event) => {
  const currentUser = getCookie(event, 'auth-user')
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = currentUser ? getPostHogDistinctId(currentUser) : getHeader(event, 'x-posthog-distinct-id') || 'anonymous_logout'

  useServerPostHog().capture({
    distinctId,
    event: 'server_logout_succeeded',
    properties: {
      $session_id: sessionId,
      logout_surface: 'primary_navigation',
    },
  })

  deleteCookie(event, 'auth-user')
  return { success: true }
})
