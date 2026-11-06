import posthog, { isPostHogConfigured } from '@/lib/posthog.client'

type PostHogLogAttributes = Record<string, boolean | number | string>

export const posthogLogger = {
  info: (message: string, attributes: PostHogLogAttributes) => {
    if (!isPostHogConfigured) return

    posthog.logger.info(message, attributes)
  },
}
