import posthog from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (token && host) {
  posthog.init(token, {
    api_host: host,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  })
} else if (process.env.NODE_ENV === 'development') {
  const missing = !token ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'
  throw new Error(
    `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
  )
}

export default posthog
