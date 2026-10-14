import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

let isPostHogInitialized = false

export async function init() {
  const projectToken = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (dev) {
      const missingVariable = !projectToken
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
    capture_exceptions: true,
  })
  isPostHogInitialized = true
}

export const handleError: HandleClientError = ({ error }) => {
  if (isPostHogInitialized) {
    posthog.captureException(error)
  }
}
