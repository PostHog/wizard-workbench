import { useServerPostHog } from '~/server/utils/posthog'

export default defineEventHandler((event) => {
  useServerPostHog().capture({
    distinctId: getHeader(event, 'x-posthog-distinct-id') || 'anonymous_api_root',
    event: 'api_root_requested',
    properties: {
      $session_id: getHeader(event, 'x-posthog-session-id'),
      request_method: event.method,
    },
  })

  return 'Nuxt Movies API'
})
