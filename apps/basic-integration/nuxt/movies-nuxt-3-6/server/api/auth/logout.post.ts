import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const publicKey = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!publicKey || !host) {
    if (process.dev) {
      const missingVariable = !publicKey
        ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NUXT_PUBLIC_POSTHOG_HOST'

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
  } else {
    const posthog = new PostHog(publicKey, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
    const sessionId = getHeader(event, 'x-posthog-session-id')
    const distinctId = getHeader(event, 'x-posthog-distinct-id')

    if (distinctId) {
      posthog.capture({
        distinctId,
        event: 'authentication_logout_succeeded',
        properties: { $session_id: sessionId || undefined },
      })
    }
    await posthog.shutdown()
  }

  deleteCookie(event, 'auth-user')
  return { success: true }
})
