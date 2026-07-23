export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = useServerPostHog()
  posthog.capture({
    distinctId: distinctId || 'anonymous',
    event: 'server_user_logged_out',
    properties: {
      $session_id: sessionId,
      source: 'api',
    },
  })
  await posthog.flush()

  deleteCookie(event, 'auth-user')
  return { success: true }
})
