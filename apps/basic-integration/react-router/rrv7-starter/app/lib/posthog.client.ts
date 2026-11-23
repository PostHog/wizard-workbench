import posthog from 'posthog-js'

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN

export const posthogClient = posthogToken
  ? posthog.init(posthogToken, {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      defaults: '2026-08-30',
      logs: {
        serviceName: 'clouthub-web',
        environment: import.meta.env.MODE,
      },
    })
  : undefined

if (!posthogClient && import.meta.env.DEV) {
  console.error(
    'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
  )
}

export const posthogLogger = posthogClient?.logger
export { posthogClient as posthog }
