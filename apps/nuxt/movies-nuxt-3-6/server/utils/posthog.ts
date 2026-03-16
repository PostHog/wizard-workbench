import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    client = new PostHog(config.public.posthog.publicKey as string, {
      host: config.public.posthog.host as string,
    })
  }
  return client
}
