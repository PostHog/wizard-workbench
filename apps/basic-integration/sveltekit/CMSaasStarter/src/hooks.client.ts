import posthog from "posthog-js"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"

export async function init() {
  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: PUBLIC_POSTHOG_HOST,
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
  posthog.captureException(error)

  return {
    message,
    status,
  }
}
