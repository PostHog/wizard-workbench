import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import { useEffect, useState, type ReactNode } from 'react'
import type { PostHog } from 'posthog-js'

interface PostHogClientProviderProps {
  children: ReactNode
}

export function PostHogClientProvider({ children }: PostHogClientProviderProps) {
  const [client, setClient] = useState<PostHog>()

  useEffect(() => {
    const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
    const host = import.meta.env.VITE_POSTHOG_HOST

    if (!token) {
      if (import.meta.env.DEV) {
        console.error(
          new Error(
            'VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured'
          )
        )
      }
      return
    }

    if (!host) {
      if (import.meta.env.DEV) {
        console.error(
          new Error(
            'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'
          )
        )
      }
      return
    }

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        defaults: '2026-08-30',
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
      setClient(posthog)
    })
  }, [])

  if (!client) return children

  return (
    <PostHogProvider client={client}>
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </PostHogProvider>
  )
}
