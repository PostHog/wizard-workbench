import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

function getPostHogClient() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) {
    if (dev) {
      const missingVariable = !PUBLIC_POSTHOG_PROJECT_TOKEN
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
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

interface CapturePostHogEvent {
  distinctId?: string
  event: string
  properties?: Record<string, boolean | number | string | undefined>
}

export async function capturePostHogEvent({
  distinctId,
  event,
  properties,
}: CapturePostHogEvent) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({ distinctId, event, properties })
  await posthog.flush()
}
