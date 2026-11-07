import type { PostHog } from 'posthog-js'

let posthogPromise: Promise<PostHog | undefined> | undefined

export function getPostHog(): Promise<PostHog | undefined> {
  if (typeof window === 'undefined') return Promise.resolve(undefined)

  if (!posthogPromise) {
    const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
    const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

    if (!projectToken) {
      if (import.meta.env.DEV) {
        throw new Error(
          'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
        )
      }

      return Promise.resolve(undefined)
    }

    if (!host) {
      if (import.meta.env.DEV) {
        throw new Error(
          'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
        )
      }

      return Promise.resolve(undefined)
    }

    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: host,
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

      return posthog
    })
  }

  return posthogPromise
}
