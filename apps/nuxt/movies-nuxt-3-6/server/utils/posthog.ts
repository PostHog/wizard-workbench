import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    client = new PostHog(config.public.posthogPublicKey as string, {
      host: config.public.posthogHost as string,
    })
  }
  return client
}
