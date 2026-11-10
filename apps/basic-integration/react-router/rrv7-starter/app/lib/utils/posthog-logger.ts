import posthog from 'posthog-js'

type LogAttributes = Record<string, string | number | boolean>

export const posthogLogger = {
  info: (message: string, attributes: LogAttributes) => {
    if (posthog.__loaded) {
      posthog.logger.info(message, attributes)
    }
  },
}
