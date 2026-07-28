import { env } from "$env/dynamic/private"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null | undefined

function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient
  }

  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST
  if (!token || !host) {
    if (env.NODE_ENV !== "production") {
      const missing = !token
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
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

export async function captureAuthenticatedEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, boolean | number | string>,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({ distinctId, event, properties })
  await posthog.flush()
}

export async function capturePersonlessEvent(
  event: string,
  properties?: Record<string, boolean | number | string>,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({
    distinctId: crypto.randomUUID(),
    event,
    properties: { ...properties, $process_person_profile: false },
  })
  await posthog.flush()
}
