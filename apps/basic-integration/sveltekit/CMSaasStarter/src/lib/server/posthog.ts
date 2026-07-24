import { PostHog } from "posthog-node"
import {
  PUBLIC_POSTHOG_PROJECT_TOKEN,
  PUBLIC_POSTHOG_HOST,
} from "$env/static/public"

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  if (!posthogClient) {
    if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
        )
      }
      return null
    }
    posthogClient = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}
