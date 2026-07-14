import type { HandleClientError } from "@sveltejs/kit"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import posthog from "posthog-js"

export async function init() {
  if (!PUBLIC_POSTHOG_PROJECT_TOKEN) {
    return
  }

  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    ui_host: PUBLIC_POSTHOG_HOST.replace(".i.", "."),
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
  posthog.captureException(error, {
    $exception_list: [
      {
        type: error instanceof Error ? error.name : "Error",
        value: error instanceof Error ? error.message : String(error),
      },
    ],
    route_id: event.route.id ?? "unknown",
    status,
  })

  return {
    message,
    status,
  }
}
