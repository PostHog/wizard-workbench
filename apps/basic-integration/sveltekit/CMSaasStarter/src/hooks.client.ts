import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export function init() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }

  if (!host) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  posthog.init(token, {
    api_host: host,
    capture_exceptions: true,
    logs: {
      serviceName: "cmsaasstarter-web",
      environment: dev ? "development" : "production",
    },
  })
}

export const handleError: HandleClientError = ({ error }) => {
  posthog.captureException(error)
}
