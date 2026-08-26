import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null | undefined

function getPostHogClient() {
  if (posthogClient !== undefined) {
    return posthogClient
  }

  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const variable = token
        ? "PUBLIC_POSTHOG_HOST"
        : "PUBLIC_POSTHOG_PROJECT_TOKEN"
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
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

export async function captureServerEvent(
  event: string,
  properties: Record<string, boolean | number | string>,
  distinctId?: string,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({ event, properties, ...(distinctId ? { distinctId } : {}) })
  await posthog.flush()
}
