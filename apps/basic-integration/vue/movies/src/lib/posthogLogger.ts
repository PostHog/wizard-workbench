import posthog from 'posthog-js'

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogAppLogger = {
  info(message: string, attributes: Record<string, unknown> = {}) {
    if (isPostHogConfigured) {
      posthog.logger.info(message, attributes)
    }
  },
  warn(message: string, attributes: Record<string, unknown> = {}) {
    if (isPostHogConfigured) {
      posthog.logger.warn(message, attributes)
    }
  },
}
