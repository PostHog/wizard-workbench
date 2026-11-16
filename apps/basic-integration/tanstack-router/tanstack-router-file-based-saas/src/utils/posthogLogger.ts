import type { PostHog } from 'posthog-js'

type LogAttributes = Record<string, boolean | number | string>

export function createPostHogLogger(posthog: PostHog) {
  return {
    info(message: string, attributes?: LogAttributes) {
      posthog.logger.info(message, attributes)
    },
  }
}
