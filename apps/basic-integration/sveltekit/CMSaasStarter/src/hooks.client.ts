import {
  PUBLIC_POSTHOG_HOST,
  PUBLIC_POSTHOG_PROJECT_TOKEN,
} from "$env/static/public"
import posthog from "posthog-js"
import type { HandleClientError } from "@sveltejs/kit"

export async function init() {
  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = async ({ error, event }) => {
  posthog.captureException(error, {
    $current_url: event.url.pathname,
  })

  return {
    message: "An unexpected error occurred",
  }
}
