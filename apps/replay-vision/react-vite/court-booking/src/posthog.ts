import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

function missingEnvError(name: string) {
  return new Error(
    `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`
  )
}

if (POSTHOG_KEY && POSTHOG_HOST) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: '2026-05-30',
  })
} else if (import.meta.env.DEV) {
  throw missingEnvError(!POSTHOG_KEY ? 'VITE_PUBLIC_POSTHOG_KEY' : 'VITE_PUBLIC_POSTHOG_HOST')
}

export default posthog
