import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    client = new PostHog(config.public.posthog.publicKey, {
      host: config.public.posthog.host,
      enableExceptionAutocapture: true,
    })
  }

  return client
}
