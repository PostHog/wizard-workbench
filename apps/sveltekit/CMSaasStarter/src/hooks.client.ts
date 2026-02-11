import posthog from "posthog-js"
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"

// Initialize PostHog when the app starts in the browser
export async function init() {
  posthog.init(PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: PUBLIC_POSTHOG_HOST.replace(".i.posthog.com", ".posthog.com"),
    capture_pageview: false, // SvelteKit handles this
    capture_pageleave: true,
    capture_exceptions: true,
  })
}

// Capture client-side errors with PostHog
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
