import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from "$env/static/public"
import { logServerActionCompleted } from "$lib/server/posthog-logs"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null | undefined

function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient
  }

  if (!PUBLIC_POSTHOG_KEY) {
    if (dev) {
      console.warn(
        "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
      )
    }
    posthogClient = null
    return posthogClient
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      console.warn(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    posthogClient = null
    return posthogClient
  }

  posthogClient = new PostHog(PUBLIC_POSTHOG_KEY, {
    host: PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0,
    enableExceptionAutocapture: true,
  })
  return posthogClient
}

export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId?: string
  event: string
  properties?: Record<string, boolean | number | string | undefined>
}) {
  const posthog = getPostHogClient()
  if (!posthog) {
    return
  }

  try {
    posthog.capture({ distinctId, event, properties })
    logServerActionCompleted({
      action: event,
      isAuthenticated: Boolean(distinctId),
    })
    await posthog.flush().catch(() => {})
  } catch {
    // Analytics failures must not affect the completed application action.
  }
}
