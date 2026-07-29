import posthog from "posthog-js"
import type { HandleClientError } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"

export async function init() {
  if (!env.PUBLIC_POSTHOG_PROJECT_TOKEN) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }

  if (!env.PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  posthog.init(env.PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: env.PUBLIC_POSTHOG_HOST,
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
  if (env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }

  return {
    message,
    status,
  }
}
