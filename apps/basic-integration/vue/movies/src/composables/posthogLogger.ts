import posthog from 'posthog-js'

type LogAttributes = Record<string, string | number | boolean>

const isPostHogConfigured = () => Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogLogger = {
  info(message: string, attributes: LogAttributes) {
    if (isPostHogConfigured()) {
      posthog.logger.info(message, attributes)
    }
  },
  error(message: string, attributes: LogAttributes) {
    if (isPostHogConfigured()) {
      posthog.logger.error(message, attributes)
    }
  },
}
