import posthog from "posthog-js"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import type { HandleClientError } from "@sveltejs/kit"

const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN
const host = env.PUBLIC_POSTHOG_HOST
let initialized = false

export async function init() {
  if (!token || !host) {
    if (dev) {
      throw new Error(
        `${!token ? "PUBLIC_POSTHOG_PROJECT_TOKEN" : "PUBLIC_POSTHOG_HOST"} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!token ? "PUBLIC_POSTHOG_PROJECT_TOKEN" : "PUBLIC_POSTHOG_HOST"} is configured`,
      )
    }
    return
  }

  posthog.init(token, {
    api_host: host,
    capture_exceptions: true,
  })
  initialized = true
}

export const handleError: HandleClientError = async ({ error, message, status }) => {
  if (initialized) {
    posthog.captureException(error)
  }

  return { message, status }
}

export { posthog }
