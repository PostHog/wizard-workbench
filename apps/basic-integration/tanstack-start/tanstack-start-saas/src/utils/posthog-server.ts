import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

const posthogProjectToken =
  process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost =
  process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

function requirePostHogConfiguration() {
  if (import.meta.env.DEV && !posthogProjectToken) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
    )
  }

  if (import.meta.env.DEV && !posthogHost) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
    )
  }
}

export function getPostHogClient() {
  requirePostHogConfiguration()

  if (!posthogProjectToken || !posthogHost) {
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(posthogProjectToken, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
