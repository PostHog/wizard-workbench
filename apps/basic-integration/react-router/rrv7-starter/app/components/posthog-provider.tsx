import { PostHogProvider } from '@posthog/react'
import { useEffect, useState, type ReactNode } from 'react'
import type { PostHog } from 'posthog-js'

let posthogClient: Promise<PostHog> | undefined

export function initializePostHog(projectToken: string, host: string) {
  posthogClient ??= import('posthog-js').then(({ default: posthog }) => {
    posthog.init(projectToken, {
      api_host: host,
      defaults: '2026-05-30',
    })

    return posthog
  })

  return posthogClient
}

export function PostHogClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PostHog>()

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

    void initializePostHog(projectToken, host).then(setClient)
  }, [])

  return client ? <PostHogProvider client={client}>{children}</PostHogProvider> : children
}
