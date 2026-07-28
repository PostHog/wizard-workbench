import posthog from "posthog-js"
import type { HandleClientError } from "@sveltejs/kit"
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from "$env/static/public"

export async function init() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) {
    if (import.meta.env.DEV) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN and PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once they are configured",
      )
    }
    return
  }

  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: PUBLIC_POSTHOG_HOST,
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
  if (PUBLIC_POSTHOG_PROJECT_TOKEN && PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }

  return { status, message }
}
