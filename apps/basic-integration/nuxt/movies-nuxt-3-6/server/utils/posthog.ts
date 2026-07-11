import { type H3Event, getCookie, getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export function createServerPostHog() {
  const runtimeConfig = useRuntimeConfig()

  return new PostHog(runtimeConfig.public.posthog.publicKey, {
    host: runtimeConfig.public.posthog.host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  })
}

export function getPostHogContext(event: H3Event) {
  return {
    sessionId: getHeader(event, 'x-posthog-session-id') ?? undefined,
    distinctId: getHeader(event, 'x-posthog-distinct-id') ?? getCookie(event, 'auth-user') ?? undefined,
  }
}
