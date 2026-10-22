import { useEffect, useState, type ReactNode } from 'react'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import type { PostHog } from 'posthog-js'

let posthogClientPromise: Promise<PostHog> | null = null

export function PostHogClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PostHog | null>(null)

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

    let cancelled = false

    if (!posthogClientPromise) {
      posthogClientPromise = import('posthog-js').then(({ default: posthog }) => {
        posthog.init(projectToken, {
          api_host: host,
          defaults: '2026-01-30',
          logs: {
            serviceName: 'rrv7-starter-web',
            environment: import.meta.env.MODE,
          },
        })

        return posthog
      })
    }

    void posthogClientPromise.then((posthog) => {
      if (!cancelled) {
        setClient(posthog)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return client ? (
    <PostHogProvider client={client}>
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </PostHogProvider>
  ) : (
    children
  )
}
