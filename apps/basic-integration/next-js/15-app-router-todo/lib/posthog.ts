import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window === 'undefined') return

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!posthogKey || !posthogHost) {
    console.warn('PostHog configuration missing')
    return
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_exceptions: true,
  })
}
