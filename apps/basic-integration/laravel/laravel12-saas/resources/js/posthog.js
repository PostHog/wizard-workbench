import posthog from 'posthog-js'

export function initPostHog() {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
  })

  if (window.posthogUser) {
    posthog.identify(window.posthogUser.id, {
      email: window.posthogUser.email,
      name: window.posthogUser.name,
    })
  }
}

export default posthog
