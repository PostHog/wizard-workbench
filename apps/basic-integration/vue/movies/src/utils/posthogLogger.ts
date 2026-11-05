import posthog from 'posthog-js'

const isPostHogConfigured = () => Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogLogger = {
  loginCompleted() {
    if (isPostHogConfigured()) {
      posthog.logger.info('user login completed', {
        event: 'user_login_completed',
      })
    }
  },

  searchCompleted(resultCount: number) {
    if (isPostHogConfigured()) {
      posthog.logger.info('media search completed', {
        event: 'media_search_completed',
        result_count: resultCount,
      })
    }
  },
}
