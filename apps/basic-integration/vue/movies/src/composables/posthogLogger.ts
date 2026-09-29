import posthog from 'posthog-js'

type LogAttributes = Record<string, string | number | boolean | undefined>

const isConfigured = () => Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogLogger = {
  info(message: string, attributes: LogAttributes = {}) {
    if (isConfigured()) {
      posthog.logger.info(message, attributes)
    }
  },
}
