import posthog from "posthog-js"
import { browser } from "$app/environment"
import {
  PUBLIC_POSTHOG_HOST,
  PUBLIC_POSTHOG_PROJECT_TOKEN,
} from "$env/static/public"

let initialized = false

export function initPostHog() {
  if (!browser || initialized || !PUBLIC_POSTHOG_PROJECT_TOKEN) {
    return
  }

  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })

  initialized = true
}

export { posthog }
