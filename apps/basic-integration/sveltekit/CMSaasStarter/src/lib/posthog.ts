import { env } from "$env/dynamic/public"
import posthog from "posthog-js"

const isPostHogConfigured = Boolean(
  env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST,
)

export function capturePostHog(
  event: string,
  properties?: Record<string, unknown>,
) {
  if (isPostHogConfigured) {
    posthog.capture(event, properties)
  }
}
