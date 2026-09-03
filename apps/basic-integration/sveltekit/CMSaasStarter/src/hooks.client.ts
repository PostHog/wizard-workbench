import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

const posthogConfigured =
  Boolean(PUBLIC_POSTHOG_PROJECT_TOKEN) && Boolean(PUBLIC_POSTHOG_HOST)

export async function init() {
  const missingVariable = !PUBLIC_POSTHOG_PROJECT_TOKEN
    ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
    : !PUBLIC_POSTHOG_HOST
      ? "PUBLIC_POSTHOG_HOST"
      : null

  if (missingVariable) {
    if (dev) {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = ({ error, status, message }) => {
  if (posthogConfigured) {
    posthog.captureException(error)
  }

  return { message, status }
}
