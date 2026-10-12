import posthog, { isPostHogConfigured } from '@/lib/posthog.client'

type LogAttributes = Record<string, string | number | boolean>

export const posthogLog = {
  info(message: string, attributes: LogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.info(message, attributes)
    }
  },
}
