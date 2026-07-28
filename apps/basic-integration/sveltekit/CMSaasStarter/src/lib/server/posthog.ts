import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null | undefined

export function getPostHogClient() {
  if (posthogClient !== undefined) return posthogClient

  if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) {
    if (import.meta.env.DEV) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN and PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once they are configured",
      )
    }
    posthogClient = null
    return posthogClient
  }

  posthogClient = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    host: PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  })

  return posthogClient
}
