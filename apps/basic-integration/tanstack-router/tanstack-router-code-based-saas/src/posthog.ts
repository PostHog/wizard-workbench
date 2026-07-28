const apiKey = import.meta.env.VITE_POSTHOG_KEY
const apiHost = import.meta.env.VITE_POSTHOG_HOST

if ((!apiKey || !apiHost) && import.meta.env.DEV) {
  throw new Error(
    `${!apiKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!apiKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'} is configured`,
  )
}

export const posthogConfig = apiKey && apiHost
  ? {
      apiKey,
      options: {
        api_host: apiHost,
        capture_exceptions: true,
      },
    }
  : null
