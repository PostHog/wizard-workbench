import posthog from 'posthog-js'

export const posthogAppLogger = {
  loginCompleted() {
    posthog.logger.info('Demo login completed')
  },

  searchCompleted(resultsCount: number) {
    posthog.logger.info('Media search completed', { results_count: resultsCount })
  },

  searchFailed() {
    posthog.logger.warn('Media search failed')
  },
}
