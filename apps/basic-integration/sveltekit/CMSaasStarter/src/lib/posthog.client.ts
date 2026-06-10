import posthog from 'posthog-js'

export const initPostHog = () => {
  const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!posthogKey || !posthogHost) {
    console.warn('PostHog is not configured. Skipping initialization.')
    return
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: 'identified_only',
  })
}
