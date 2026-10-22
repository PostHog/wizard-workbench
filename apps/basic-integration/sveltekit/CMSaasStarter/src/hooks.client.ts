import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export function init() {
  const key = env.PUBLIC_POSTHOG_KEY
  const host = env.PUBLIC_POSTHOG_HOST

  if (!key) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
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

  posthog.init(key, {
    api_host: host,
    defaults: "2025-05-24",
    logs: {
      serviceName: "cmsaasstarter-web",
      environment: dev ? "development" : "production",
    },
  })
}

export const handleError: HandleClientError = ({ error }) => {
  if (env.PUBLIC_POSTHOG_KEY && env.PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }
}
