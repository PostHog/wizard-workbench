import { dev } from "$app/environment"
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from "$env/static/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

// Initialize PostHog once when the app starts in the browser.
export function init() {
  if (!PUBLIC_POSTHOG_KEY) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured",
      )
    }
    return
  }

  if (!PUBLIC_POSTHOG_HOST) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  posthog.init(PUBLIC_POSTHOG_KEY, {
    api_host: PUBLIC_POSTHOG_HOST,
    logs: {
      serviceName: "cmsaasstarter-web",
      environment: dev ? "development" : "production",
    },
  })
}

// Capture uncaught client-side errors through SvelteKit's global error hook.
export const handleError: HandleClientError = ({ error, message, status }) => {
  if (PUBLIC_POSTHOG_KEY && PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }

  return { message, status }
}
