import type { PostHog } from 'posthog-js'

type LogAttributes = Record<string, string | number | boolean>

export const posthogAppLogger = {
  info(posthog: PostHog | undefined, message: string, attributes: LogAttributes) {
    posthog?.logger.info(message, attributes)
  },
}
