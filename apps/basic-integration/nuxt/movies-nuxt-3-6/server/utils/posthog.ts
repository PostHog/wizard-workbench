import { type H3Event, getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export async function captureServerEvent(
  event: H3Event,
  eventName: string,
  properties?: Record<string, string | number | boolean>,
) {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthog.publicKey
  const host = runtimeConfig.public.posthog.host

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const variable = !token ? 'NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NUXT_PUBLIC_POSTHOG_HOST'
      console.warn(`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`)
    }
    return
  }

  const posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0,
  })
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  const sessionId = getHeader(event, 'x-posthog-session-id')

  try {
    if (distinctId) {
      await posthog.withContext({ distinctId, sessionId: sessionId ?? undefined }, async () => {
        posthog.capture({ event: eventName, properties })
      })
    }
    else {
      posthog.capture({ event: eventName, properties })
    }
  }
  catch {
    // Analytics delivery must not affect the application response.
  }
  finally {
    await posthog.shutdown().catch(() => {})
  }
}
