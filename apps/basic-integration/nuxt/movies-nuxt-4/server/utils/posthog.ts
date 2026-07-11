import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    const publicKey = config.public.posthog?.publicKey
    const host = config.public.posthog?.host

    if (!publicKey) {
      throw new Error('Missing public PostHog key in runtime config')
    }

    client = new PostHog(publicKey, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return client
}
