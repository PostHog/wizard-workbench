import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host
  if (projectToken && host) {
    try {
      const posthog = new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
        flushAt: 1,
        flushInterval: 0,
      })
      const distinctId = getHeader(event, 'x-posthog-distinct-id') ?? 'DISTINCT_ID'
      const sessionId = getHeader(event, 'x-posthog-session-id')

      posthog.capture({
        event: 'logout_completed',
        distinctId,
        properties: {
          $session_id: sessionId ?? undefined,
        },
      })
      await posthog.shutdown()
    }
    catch (error) {
      console.warn('PostHog logout capture failed:', error)
    }
  }

  deleteCookie(event, 'auth-user')
  return { success: true }
})
