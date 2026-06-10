import posthog from 'posthog-js'

export function initializePostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  const host = import.meta.env.VITE_POSTHOG_HOST

  if (!key || !host) {
    console.warn('PostHog credentials not configured')
    return
  }

  posthog.init(key, {
    api_host: host,
  })
}
