import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    const posthogConfig = config.public.posthog

    client = new PostHog(posthogConfig.publicKey, {
      host: posthogConfig.host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return client
}
