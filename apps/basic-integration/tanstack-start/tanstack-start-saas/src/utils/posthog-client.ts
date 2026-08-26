import posthog from 'posthog-js'

let hasInitialized = false

export function initializePostHog() {
  if (typeof window === 'undefined' || hasInitialized) return

  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!apiKey) {
    if (import.meta.env.DEV) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
      )
    }
    return
  }

  if (!apiHost) {
    if (import.meta.env.DEV) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured',
      )
    }
    return
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    capture_exceptions: true,
    debug: import.meta.env.DEV,
    defaults: '2025-05-24',
  })
  hasInitialized = true
}

export { posthog }
