import process from 'node:process'
import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog {
  if (!client) {
    const config = useRuntimeConfig()
    const posthogConfig = config.public.posthog
    if (!posthogConfig?.publicKey) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')
      }
      return { capture: () => {}, flush: async () => {}, shutdown: async () => {} } as unknown as PostHog
    }
    client = new PostHog(posthogConfig.publicKey, {
      host: posthogConfig.host || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return client
}
