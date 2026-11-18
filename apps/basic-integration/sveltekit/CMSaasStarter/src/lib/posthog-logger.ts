import posthog from "posthog-js"

type PostHogLogAttributes = Record<string, string | number | boolean | string[]>

const logger = posthog.logger

export function posthogLogInfo(
  message: string,
  attributes: PostHogLogAttributes = {},
) {
  logger.info(message, attributes)
}
