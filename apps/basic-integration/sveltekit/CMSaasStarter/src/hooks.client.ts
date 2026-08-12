import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

const projectToken = env.PUBLIC_POSTHOG_PROJECT_TOKEN
const host = env.PUBLIC_POSTHOG_HOST
const isConfigured =
  projectToken && projectToken !== "your_posthog_project_token_here" && host

export async function init() {
  if (!isConfigured) {
    if (dev) {
      const missingVariable =
        !projectToken || projectToken === "your_posthog_project_token_here"
          ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
          : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })
}

export const handleError: HandleClientError = ({ error, status, message }) => {
  if (isConfigured) {
    posthog.captureException(error)
  }

  return { status, message }
}
