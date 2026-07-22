import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const posthogConfig = useRuntimeConfig()
  const { publicKey, host } = posthogConfig.public.posthog
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  if (publicKey && host && distinctId) {
    const posthog = new PostHog(publicKey, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
    posthog.capture({
      distinctId,
      event: 'logout_completed_server',
      properties: {
        $session_id: getHeader(event, 'x-posthog-session-id') ?? undefined,
      },
    })
    await posthog.shutdown()
  }

  deleteCookie(event, 'auth-user')
  return { success: true }
})
