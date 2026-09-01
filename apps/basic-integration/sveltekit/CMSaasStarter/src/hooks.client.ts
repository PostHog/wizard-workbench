import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

let posthogInitialized = false

export async function init() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (import.meta.env.DEV) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }

    return
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (import.meta.env.DEV) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }

    return
  }

  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: PUBLIC_POSTHOG_HOST,
    capture_exceptions: true,
  })
  posthogInitialized = true
}

export const handleError: HandleClientError = ({ error, status, message }) => {
  if (posthogInitialized) {
    posthog.captureException(error)
  }

  return { message, status }
}
