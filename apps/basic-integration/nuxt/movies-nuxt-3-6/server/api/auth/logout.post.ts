import { PostHog } from 'posthog-node'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const posthog = new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    enableExceptionAutocapture: true,
  })

  try {
    deleteCookie(event, 'auth-user')

    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
      async () => {
        posthog.capture({
          event: 'server_logout_completed',
          distinctId: distinctId ?? 'anonymous',
        })
      },
    )

    return { success: true }
  }
  catch (error: any) {
    await posthog.withContext(
      { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
      async () => {
        posthog.captureException(error, distinctId ?? 'anonymous')
      },
    )
    throw error
  }
  finally {
    await posthog.shutdown()
  }
})
