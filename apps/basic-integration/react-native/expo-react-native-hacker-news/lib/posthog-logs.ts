import { posthog } from './posthog'

type StoryFeed = 'top' | 'best' | 'ask' | 'show'

export const posthogLogs = {
  storyFeedRequestCompleted: (
    feed: StoryFeed,
    statusCode: number,
    durationMs: number,
  ) => {
    const attributes = {
      feed,
      status_code: statusCode,
      duration_ms: durationMs,
    }

    if (statusCode >= 400) {
      posthog?.logger.warn('story_feed_request_completed', attributes)
      return
    }

    posthog?.logger.info('story_feed_request_completed', attributes)
  },
  storyFeedRequestFailed: (feed: StoryFeed, durationMs: number) => {
    posthog?.logger.error('story_feed_request_failed', {
      feed,
      duration_ms: durationMs,
    })
  },
}
