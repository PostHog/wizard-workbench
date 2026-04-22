import posthog from "posthog-js"
import {
  PUBLIC_POSTHOG_PROJECT_TOKEN,
  PUBLIC_POSTHOG_HOST,
} from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"

// Initialize PostHog when the app starts in the browser
export async function init() {
  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

// Capture client-side errors with PostHog
export const handleError: HandleClientError = async ({ error, message }) => {
  posthog.captureException(error)
  return { message }
}
