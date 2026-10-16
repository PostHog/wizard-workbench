import { env } from "$env/dynamic/public"
import posthog from "posthog-js"

type LogAttributes = Record<string, string | number | boolean>

const posthogConfigured = Boolean(
  env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST,
)

export const posthogLogs = {
  info(message: string, attributes?: LogAttributes) {
    if (posthogConfigured) {
      posthog.logger.info(message, attributes)
    }
  },
}
