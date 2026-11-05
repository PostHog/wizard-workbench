import posthog from 'posthog-js'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST
let posthogClient: typeof posthog | undefined

if (!posthogKey) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured'
    )
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'
    )
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    logs: {
      serviceName: 'clouthub-web',
      environment: import.meta.env.MODE,
    },
  })
  posthogClient = posthog
}

export default posthogClient
