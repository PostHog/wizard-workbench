import { PostHog } from 'posthog-node'
import { getCookie, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const distinctId = getHeader(event, 'x-posthog-distinct-id') ?? getCookie(event, 'auth-user') ?? 'anonymous'
  const sessionId = getHeader(event, 'x-posthog-session-id')

  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    enableExceptionAutocapture: true,
  })

  await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    async () => {
      posthog.capture({
        event: 'auth_logout_completed',
        distinctId,
        properties: {
          had_cookie_session: Boolean(getCookie(event, 'auth-user')),
        },
      })
    },
  )

  await posthog.shutdown()

  deleteCookie(event, 'auth-user')
  return { success: true }
})
