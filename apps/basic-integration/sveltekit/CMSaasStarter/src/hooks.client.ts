import posthog from "posthog-js"
import {
  PUBLIC_POSTHOG_PROJECT_TOKEN,
  PUBLIC_POSTHOG_HOST,
} from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"

export async function init() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (import.meta.env.DEV) {
      console.error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }
  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = async ({
  error,
  status,
  message,
}) => {
  posthog.captureException(error)

  return {
    message,
    status,
  }
}
