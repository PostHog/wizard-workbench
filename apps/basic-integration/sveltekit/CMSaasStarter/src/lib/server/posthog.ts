import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  const projectToken = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  if (!projectToken) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return null
  }

  const host = env.PUBLIC_POSTHOG_HOST
  if (!host) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(projectToken, {
      host,
      flushAt: 1,
      flushInterval: 0,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
