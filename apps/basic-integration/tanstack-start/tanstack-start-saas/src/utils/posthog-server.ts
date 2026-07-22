import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null | undefined

export function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient
  }

  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST ?? import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    posthogClient = null
    return posthogClient
  }

  posthogClient = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
  })

  return posthogClient
}
