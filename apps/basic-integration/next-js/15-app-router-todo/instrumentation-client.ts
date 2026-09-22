import posthog from "posthog-js"

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (!apiKey) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
    )
  }
} else if (!apiHost) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
    )
  }
} else {
  posthog.init(apiKey, {
    api_host: apiHost,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
