import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

const isPostHogConfigured = Boolean(
  env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST,
)

export async function init() {
  const missingVariable = !env.PUBLIC_POSTHOG_PROJECT_TOKEN
    ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
    : !env.PUBLIC_POSTHOG_HOST
      ? "PUBLIC_POSTHOG_HOST"
      : null

  if (missingVariable) {
    if (dev) {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(env.PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: env.PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = ({ error, message, status }) => {
  if (isPostHogConfigured) {
    posthog.captureException(error)
  }

  return { message, status }
}
