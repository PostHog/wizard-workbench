import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

let isPostHogInitialized = false

export async function init() {
  const token = env.PUBLIC_POSTHOG_KEY
  const host = env.PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (dev) {
      const variable = !token ? "PUBLIC_POSTHOG_KEY" : "PUBLIC_POSTHOG_HOST"
      console.error(
        new Error(
          `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
        ),
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
  isPostHogInitialized = true
}

export const handleError: HandleClientError = ({ error, status }) => {
  if (isPostHogInitialized && status !== 404) {
    posthog.captureException(error)
  }
}
