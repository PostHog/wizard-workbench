import { PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export async function init() {
  posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: "/ingest",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = ({ error, message }) => {
  posthog.captureException(error)
  return { message }
}
