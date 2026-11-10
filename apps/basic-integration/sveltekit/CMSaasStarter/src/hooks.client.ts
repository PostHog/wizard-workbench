import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export function init() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const variableName = !token
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      console.error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      )
    }
    return
  }

  posthog.init(token, {
    api_host: host,
    tracing_headers: [window.location.hostname],
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })
}

export const handleError: HandleClientError = ({ error, message, status }) => {
  posthog.captureException(error)

  return { message, status }
}
