import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST
const isConfigured = Boolean(projectToken && host)

if (!isConfigured && import.meta.env.DEV) {
  const missingVariable = !projectToken
    ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
    : 'VITE_PUBLIC_POSTHOG_HOST'

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

if (isConfigured) {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: import.meta.env.DEV,
  })
}

export const captureException = (error: unknown) => {
  if (isConfigured) {
    posthog.captureException(error)
  }
}

export default posthog
