import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_POSTHOG_HOST

if (projectToken && host) {
  posthog.init(projectToken, {
    api_host: host,
  })
} else if (import.meta.env.DEV) {
  const missingVariable = !projectToken
    ? 'VITE_POSTHOG_PROJECT_TOKEN'
    : 'VITE_POSTHOG_HOST'
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  )
}

export default posthog
