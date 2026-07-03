import { PostHog } from 'posthog-node'

export function createPostHogClient() {
  const client = new PostHog(process.env.POSTHOG_PROJECT_API_KEY as string, {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
  return client
}
