import posthog from 'posthog-js'

export function getPostHogConfig() {
  const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (import.meta.env.DEV) {
      const variable = !token
        ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'VITE_PUBLIC_POSTHOG_HOST'
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      )
    }
    return null
  }

  return {
    apiKey: token,
    options: {
      api_host: host,
      capture_exceptions: true,
    },
  }
}

export { posthog }
