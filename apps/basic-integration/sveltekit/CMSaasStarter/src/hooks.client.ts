import { dev } from "$app/environment"
import type { HandleClientError } from "@sveltejs/kit"
import { env } from "$env/dynamic/public"
import posthog from "posthog-js"

let isPostHogInitialized = false

export async function init() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const missingVariable = !token ? "PUBLIC_POSTHOG_PROJECT_TOKEN" : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(token, {
    api_host: host,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })
  isPostHogInitialized = true
}

export const handleError: HandleClientError = ({ error }) => {
  if (isPostHogInitialized) posthog.captureException(error)

  return { message: "An unexpected error occurred" }
}
