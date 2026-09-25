import type { PostHog } from 'posthog-js'

type LogAttributes = Record<string, string | number | boolean>

export const posthogLogger = {
  info: (client: PostHog | undefined, message: string, attributes: LogAttributes) => {
    client?.logger.info(message, attributes)
  },
}
