import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (!projectToken || !host) {
  if (import.meta.env.DEV) {
    if (!projectToken) {
      console.error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      )
    }

    if (!host) {
      console.error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
      )
    }
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-01-30',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: 'clouthub-web',
      environment: import.meta.env.MODE,
    },
  })
}

type PostHogProperties = Record<string, string | number | boolean>

export const capturePostHogEvent = (event: string, properties: PostHogProperties) => {
  if (!projectToken || !host) return

  posthog.capture(event, properties)
}

export const posthogLog = {
  info: (message: string, attributes: PostHogProperties) => {
    if (!projectToken || !host) return

    posthog.logger.info(message, attributes)
  },
}

export default posthog
