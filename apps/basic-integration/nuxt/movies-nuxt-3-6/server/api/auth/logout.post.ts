import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const body = await readBody<{ userId?: string }>(event).catch(() => ({}))
  const resolvedDistinctId = distinctId ?? body.userId ?? 'anonymous'
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    enableExceptionAutocapture: true,
  })

  try {
    await posthog.withContext({
      sessionId: sessionId ?? undefined,
      distinctId: resolvedDistinctId,
    }, async () => {
      posthog.capture({
        event: 'user_logged_out',
        distinctId: resolvedDistinctId,
      })
    })

    deleteCookie(event, 'auth-user')
    return { success: true }
  }
  finally {
    await posthog.shutdown()
  }
})
