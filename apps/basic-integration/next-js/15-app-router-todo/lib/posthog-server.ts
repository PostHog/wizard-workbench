import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

export function getPostHogClient(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = token
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    }
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 2000,
      fetchRetryCount: 0,
    })
  }

  return posthogClient
}

export async function flushPostHog() {
  await posthogClient?.flush().catch(() => {})
}
