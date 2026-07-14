import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

export function getPostHogServerClient() {
  if (!posthogClient) {
    const apiKey = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN

    if (!apiKey) {
      throw new Error('Missing VITE_PUBLIC_POSTHOG_PROJECT_TOKEN')
    }

    posthogClient = new PostHog(apiKey, {
      host: process.env.VITE_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
