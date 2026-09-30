import type { PostHog } from 'posthog-js'

type LogAttributes = Record<string, boolean | number | string>

export const posthogLog = {
  info: (posthog: PostHog | undefined, message: string, attributes: LogAttributes) => {
    posthog?.logger.info(message, {
      log_source: 'clouthub_browser',
      ...attributes,
    })
  },
}
