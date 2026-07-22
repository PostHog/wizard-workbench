import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | undefined

export function getPostHogClient() {
  if (!env.PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }
  if (!env.PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  if (!posthogClient) {
    posthogClient = new PostHog(env.PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: env.PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
