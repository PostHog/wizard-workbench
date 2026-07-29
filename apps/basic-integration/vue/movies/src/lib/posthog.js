import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const apiHost = import.meta.env.VITE_POSTHOG_HOST

if (!projectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured',
    )
  }
} else if (!apiHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured',
    )
  }
} else {
  posthog.init(projectToken, {
    api_host: apiHost,
  })
}

export default posthog
