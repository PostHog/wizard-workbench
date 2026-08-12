import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return null
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
