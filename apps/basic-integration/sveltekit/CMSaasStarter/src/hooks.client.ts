import { dev } from "$app/environment"
import type { HandleClientError } from "@sveltejs/kit"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from "$env/static/public"
import posthog from "posthog-js"

let isPostHogInitialized = false

export function init() {
  if (!PUBLIC_POSTHOG_KEY) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
      )
    }
    return
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  posthog.init(PUBLIC_POSTHOG_KEY, {
    api_host: PUBLIC_POSTHOG_HOST,
    tracing_headers: [window.location.hostname],
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })
  isPostHogInitialized = true
}

export function posthogIsInitialized() {
  return isPostHogInitialized
}

export const handleError: HandleClientError = ({ error, message, status }) => {
  if (isPostHogInitialized) {
    posthog.captureException(error)
  }

  return { message, status }
}
