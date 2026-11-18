import posthog from 'posthog-js'

const isPostHogConfigured = () => Boolean(
  import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST,
)

export const posthogLogger = {
  mediaSearchCompleted(resultCount: number) {
    if (isPostHogConfigured()) {
      posthog.logger.info('media_search_completed', { result_count: resultCount })
    }
  },

  mediaSearchFailed() {
    if (isPostHogConfigured()) {
      posthog.logger.warn('media_search_failed', { operation: 'media_search' })
    }
  },

  mediaCarouselLoadFailed() {
    if (isPostHogConfigured()) {
      posthog.logger.warn('media_carousel_load_failed', { operation: 'media_carousel_load' })
    }
  },
}
