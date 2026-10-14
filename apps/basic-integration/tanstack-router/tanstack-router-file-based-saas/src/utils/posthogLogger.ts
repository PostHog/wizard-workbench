import type { PostHog } from 'posthog-js'

type LogAttributes = Record<string, string | number | boolean>

const loggerName = 'cloudflow_app'

export const posthogAppLogger = {
  info(posthog: PostHog | undefined, message: string, attributes: LogAttributes = {}) {
    posthog?.logger.info(message, {
      logger_name: loggerName,
      ...attributes,
    })
  },
}
