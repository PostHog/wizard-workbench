import posthog from 'posthog-js'

export const posthogAppLogger = {
  mediaSearchCompleted(resultCount: number) {
    posthog.logger.info('media search completed', {
      operation: 'media_search',
      result_count: resultCount,
    })
  },

  mediaSearchFailed() {
    posthog.logger.error('media search failed', {
      operation: 'media_search',
    })
  },

  mediaDetailLoaded(mediaId: string, mediaType: 'movie' | 'tv', recommendationCount: number) {
    posthog.logger.info('media detail loaded', {
      operation: 'media_detail_load',
      media_id: mediaId,
      media_type: mediaType,
      recommendation_count: recommendationCount,
    })
  },

  mediaDetailLoadFailed(mediaId: string, mediaType: 'movie' | 'tv') {
    posthog.logger.error('media detail load failed', {
      operation: 'media_detail_load',
      media_id: mediaId,
      media_type: mediaType,
    })
  },
}
