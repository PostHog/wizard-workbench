import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (typeof window !== 'undefined') {
  const missingVariable = !projectToken
    ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : !host
      ? 'VITE_PUBLIC_POSTHOG_HOST'
      : undefined

  if (missingVariable) {
    if (import.meta.env.DEV) {
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }
  } else {
    posthog.init(projectToken, {
      api_host: host,
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: import.meta.env.DEV,
    })
  }
}

export { posthog }
