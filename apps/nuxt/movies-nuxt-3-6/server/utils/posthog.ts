import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    client = new PostHog(config.public.posthog.projectToken, {
      host: config.public.posthog.apiHost,
    })
  }
  return client
}
