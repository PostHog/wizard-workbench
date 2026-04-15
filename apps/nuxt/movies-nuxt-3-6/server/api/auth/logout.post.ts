export default defineEventHandler(async (event) => {
  const username = getCookie(event, 'auth-user')
  deleteCookie(event, 'auth-user')

  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const posthog = useServerPostHog()
  posthog.capture({
    distinctId: distinctId || username || 'anonymous',
    event: 'server_logout',
    properties: {
      $session_id: sessionId,
      username: username || null,
    },
  })

  return { success: true }
})
