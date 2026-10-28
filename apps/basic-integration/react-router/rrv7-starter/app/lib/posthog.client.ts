import posthog from 'posthog-js'

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_POSTHOG_HOST
const missingVariables = [
  ['VITE_POSTHOG_PROJECT_TOKEN', posthogProjectToken],
  ['VITE_POSTHOG_HOST', posthogHost],
].filter(([, value]) => !value)
export const isPostHogConfigured = missingVariables.length === 0

if (!posthogProjectToken || !posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      missingVariables
        .map(
          ([name]) =>
            `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`
        )
        .join('\n')
    )
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: '2026-01-30',
    logs: {
      serviceName: 'clouthub-web',
      environment: import.meta.env.MODE,
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  })
}

export default posthog
