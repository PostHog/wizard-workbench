import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'
import { getPostHogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  const { key, host } = useRuntimeConfig().public.posthog
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const sessionId = getHeader(event, 'x-posthog-session-id')

  deleteCookie(event, 'auth-user')

  if (key && host && distinctId) {
    try {
      const posthog = new PostHog(key, {
        host,
        enableExceptionAutocapture: true,
        flushAt: 1,
        flushInterval: 0,
        requestTimeout: 2000,
        fetchRetryCount: 0,
      })

      await posthog.withContext({ distinctId, sessionId: sessionId ?? undefined }, async () => {
        posthog.capture({
          distinctId,
          event: 'logout_completed',
        })
      })
      await posthog.shutdown().catch(() => {})
    }
    catch {
      // Analytics failures must not change the logout outcome.
    }
  }

  getPostHogLogger()?.emit({
    severityText: 'INFO',
    body: 'Demo authentication logout completed',
    attributes: {
      event: 'auth.logout.completed',
      outcome: 'success',
      posthog_context_available: Boolean(distinctId),
    },
  })

  return { success: true }
})
