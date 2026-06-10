import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = getHeader(event, 'x-posthog-session-id')
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  const posthog = new PostHog(
    runtimeConfig.public.posthog.publicKey,
    { host: runtimeConfig.public.posthog.host },
  )

  await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    async () => {
      posthog.capture({
        event: 'server_logout',
        distinctId: distinctId ?? 'anonymous',
      })
    },
  )

  await posthog.shutdown()

  deleteCookie(event, 'auth-user')
  return { success: true }
})
