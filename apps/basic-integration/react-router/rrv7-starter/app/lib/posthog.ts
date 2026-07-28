import type { PostHog } from 'posthog-js'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST
let clientPromise: Promise<PostHog | null> | undefined

export function getPostHogClient() {
  if (typeof window === 'undefined') return Promise.resolve(null)

  clientPromise ??= import('posthog-js').then(({ default: posthog }) => {
    if (!projectToken || !host) {
      if (import.meta.env.DEV) {
        throw new Error(
          !projectToken
            ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
            : 'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
        )
      }
      return null
    }

    posthog.init(projectToken, {
      api_host: host,
      defaults: '2026-01-30',
    })
    return posthog
  })

  return clientPromise
}

export function capture(event: string, properties: Record<string, unknown>) {
  void getPostHogClient().then((posthog) => posthog?.capture(event, properties))
}
