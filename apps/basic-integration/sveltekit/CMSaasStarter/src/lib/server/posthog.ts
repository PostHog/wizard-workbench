import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null | undefined

function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient
  }

  if (!env.PUBLIC_POSTHOG_PROJECT_TOKEN || !env.PUBLIC_POSTHOG_HOST) {
    if (dev) {
      const missingVariable = !env.PUBLIC_POSTHOG_PROJECT_TOKEN
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    posthogClient = null
    return posthogClient
  }

  posthogClient = new PostHog(env.PUBLIC_POSTHOG_PROJECT_TOKEN, {
    host: env.PUBLIC_POSTHOG_HOST,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, boolean | number | string>,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({ distinctId, event, properties })
  await posthog.flush()
}

export async function captureServerException(
  error: unknown,
  distinctId?: string,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.captureException(error, distinctId)
  await posthog.flush()
}
