import posthog from 'posthog-js'

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

const posthogClient =
  token && host
    ? posthog.init(token, {
        api_host: host,
        defaults: '2026-01-30',
      })
    : undefined

if (import.meta.env.DEV) {
  for (const missingVariable of [
    !token && 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN',
    !host && 'VITE_PUBLIC_POSTHOG_HOST',
  ].filter(Boolean)) {
    console.error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    )
  }
}

export default posthogClient
