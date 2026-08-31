import posthog from 'posthog-js'

const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

export const posthogEnabled = Boolean(apiKey && apiHost)

if (typeof window !== 'undefined') {
  if (!apiKey || !apiHost) {
    if (import.meta.env.DEV) {
      const variableName = !apiKey
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'

      throw new Error(
        `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
      )
    }
  } else {
    posthog.init(apiKey, {
      api_host: apiHost,
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: import.meta.env.DEV,
    })
  }
}

export { posthog }
