import posthog from 'posthog-js'

const posthogIsConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogLogger = {
  info(message: string, attributes: Record<string, string | number | boolean>) {
    if (posthogIsConfigured) {
      posthog.logger.info(message, attributes)
    }
  },
  warn(message: string, attributes: Record<string, string | number | boolean>) {
    if (posthogIsConfigured) {
      posthog.logger.warn(message, attributes)
    }
  },
}
