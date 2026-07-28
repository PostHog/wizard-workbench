import posthog from "posthog-js"
import type { HandleClientError } from "@sveltejs/kit"
import { env } from "$env/dynamic/public"

let isInitialized = false

export async function init() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST
  if (!token || !host) {
    if (import.meta.env.DEV) {
      const missing = !token
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
      )
    }
    return
  }

  posthog.init(token, {
    api_host: host,
    capture_exceptions: true,
  })
  isInitialized = true
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
  if (isInitialized) {
    posthog.captureException(error)
  }

  return { status, message }
}
