import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null | undefined

export function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient
  }

  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    posthogClient = null
    return posthogClient
  }

  if (!host) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    posthogClient = null
    return posthogClient
  }

  posthogClient = new PostHog(token, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  })
  return posthogClient
}

export async function capturePostHogEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, boolean | number | string | undefined>,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({ distinctId, event, properties })
  await posthog.flush()
}
