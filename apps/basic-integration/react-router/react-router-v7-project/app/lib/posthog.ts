import posthog from 'posthog-js'

export function initPostHog() {
  const publicKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  const publicHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!publicKey || !publicHost) {
    console.warn('PostHog environment variables not configured')
    return
  }

  posthog.init(publicKey, {
    api_host: publicHost,
  })
}

export default posthog
