import posthog from 'posthog-js'

export function initPostHog() {
  const token = import.meta.env.VITE_POSTHOG_TOKEN
  const host = import.meta.env.VITE_POSTHOG_HOST

  if (!token || !host) {
    console.warn('PostHog configuration incomplete. Token and host are required.')
    return
  }

  posthog.init(token, {
    api_host: host,
    person_profiles: 'identified_only',
  })
}
