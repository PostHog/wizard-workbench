import posthog, { isPostHogConfigured } from './posthog.client'

type LogAttributes = Record<string, string | number | boolean>

export const posthogLogger = {
  info: (message: string, attributes: LogAttributes) => {
    if (isPostHogConfigured) {
      posthog.logger.info(message, attributes)
    }
  },
}

export { isPostHogConfigured }
export default posthog
