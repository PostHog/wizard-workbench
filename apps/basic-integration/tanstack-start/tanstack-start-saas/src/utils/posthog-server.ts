import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  if (!posthogClient) {
    const apiKey = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
    const host = process.env.VITE_PUBLIC_POSTHOG_HOST

    if (!apiKey || !host) {
      throw new Error('PostHog environment variables are not configured')
    }

    posthogClient = new PostHog(apiKey, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }
  return posthogClient
}
