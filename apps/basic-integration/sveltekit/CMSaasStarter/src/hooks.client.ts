import { browser, dev } from "$app/environment"
import type { HandleClientError } from "@sveltejs/kit"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import posthog from "posthog-js"

export async function init() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN || !PUBLIC_POSTHOG_HOST) {
    if (dev) {
      const missingVariable = !PUBLIC_POSTHOG_PROJECT_TOKEN
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  if (browser) {
    posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
      api_host: PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
      capture_exceptions: true,
      tracing_headers: [window.location.hostname],
    })
  }
}

export const handleError: HandleClientError = ({ error, status, message }) => {
  if (PUBLIC_POSTHOG_PROJECT_TOKEN && PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }

  return { status, message }
}
