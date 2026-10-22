import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export function init() {
  const key = env.PUBLIC_POSTHOG_KEY
  const host = env.PUBLIC_POSTHOG_HOST

  if (!key || !host) {
    if (dev) {
      const missingVariable = !key
        ? "PUBLIC_POSTHOG_KEY"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(key, {
    api_host: host,
    capture_exceptions: true,
    logs: {
      serviceName: "cmsassstarter-web",
    },
    __add_tracing_headers: [window.location.hostname],
  })
}

export const handleError: HandleClientError = ({ error }) => {
  if (posthog.__loaded) {
    posthog.captureException(error)
  }
}
