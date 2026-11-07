import type { HandleClientError } from "@sveltejs/kit"
import { env } from "$env/dynamic/public"
import posthog from "posthog-js"

export function init() {
  const key = env.PUBLIC_POSTHOG_KEY
  const host = env.PUBLIC_POSTHOG_HOST

  if (!key) {
    if (import.meta.env.DEV) {
      throw new Error(
        "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
      )
    }
    return
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  posthog.init(key, {
    api_host: host,
    capture_exceptions: true,
  })
}

export const handleError: HandleClientError = ({ error, status, message }) => {
  if (posthog.__loaded) {
    posthog.captureException(error)
  }

  return { message, status }
}
