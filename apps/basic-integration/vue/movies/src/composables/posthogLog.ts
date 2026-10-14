import posthog from 'posthog-js'

type PostHogLogAttributes = Record<string, boolean | number | string>

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogLog = {
  info(body: string, attributes?: PostHogLogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.info(body, attributes)
    }
  },
  warn(body: string, attributes?: PostHogLogAttributes) {
    if (isPostHogConfigured) {
      posthog.logger.warn(body, attributes)
    }
  },
}
