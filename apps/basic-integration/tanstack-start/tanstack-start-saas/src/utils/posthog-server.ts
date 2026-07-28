import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  const token = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `${!token ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'VITE_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!token ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'VITE_PUBLIC_POSTHOG_HOST'} is configured`,
      )
    }
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
