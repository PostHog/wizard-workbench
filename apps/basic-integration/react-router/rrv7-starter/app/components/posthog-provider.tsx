import { type ReactNode, useEffect, useState } from 'react'
import type { PostHog } from 'posthog-js'

type PostHogReact = typeof import('@posthog/react')

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [posthog, setPosthog] = useState<PostHog>()
  const [posthogReact, setPosthogReact] = useState<PostHogReact>()

  useEffect(() => {
    const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
    const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

    if (!projectToken) {
      if (import.meta.env.DEV) {
        throw new Error(
          'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
        )
      }
      return
    }

    if (!host) {
      if (import.meta.env.DEV) {
        throw new Error(
          'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
        )
      }
      return
    }

    void Promise.all([import('posthog-js'), import('@posthog/react')]).then(([{ default: posthog }, react]) => {
      posthog.init(projectToken, {
        api_host: host,
        defaults: '2026-05-30',
        capture_exceptions: {
          capture_console_errors: false,
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
        },
      })
      setPosthog(posthog)
      setPosthogReact(react)
    })
  }, [])

  if (!posthogReact || !posthog) return children

  const { PostHogErrorBoundary, PostHogProvider: Provider } = posthogReact

  return (
    <Provider client={posthog}>
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </Provider>
  )
}
