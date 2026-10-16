import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

const projectToken = env.PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = env.PUBLIC_POSTHOG_HOST

export async function init() {
  if (!projectToken) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }

  if (!posthogHost) {
    if (dev) {
      throw new Error(
        "PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  posthog.init(projectToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    logs: {
      serviceName: "cmsassstarter-web",
      environment: dev ? "development" : "production",
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })
}

export const handleError: HandleClientError = ({ error, message }) => {
  if (projectToken && posthogHost) {
    posthog.captureException(error)
  }

  return { message }
}
