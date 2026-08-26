import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export function init() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const variable = token
        ? "PUBLIC_POSTHOG_HOST"
        : "PUBLIC_POSTHOG_PROJECT_TOKEN"
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      )
    }

    return
  }

  posthog.init(token, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = ({ error, message, status }) => {
  posthog.captureException(error)

  return { message, status }
}
