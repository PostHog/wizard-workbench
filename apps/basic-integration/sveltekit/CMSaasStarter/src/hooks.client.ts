import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export async function init() {
  const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const missingVariable = token
        ? "PUBLIC_POSTHOG_HOST"
        : "PUBLIC_POSTHOG_PROJECT_TOKEN"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(token, {
    api_host: host,
    logs: {
      serviceName: "cmsaasstarter-web",
      environment: dev ? "development" : "production",
    },
  })
}

export const handleError: HandleClientError = async ({
  error,
  status,
  message,
}) => {
  if (env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }

  return { message, status }
}
