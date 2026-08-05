import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import type { PostHog } from 'posthog-js'
import type { PostHogErrorBoundary as PostHogErrorBoundaryComponent } from '@posthog/react'

let posthogClient: PostHog | null = null
let PostHogProvider: ComponentType<{ children: ReactNode; client: PostHog }> | null = null
let PostHogErrorBoundary: typeof PostHogErrorBoundaryComponent | null = null

interface PostHogClientProviderProps {
  children: ReactNode
}

export function PostHogClientProvider({ children }: PostHogClientProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
    const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

    if (!projectToken || !host) {
      if (import.meta.env.DEV) {
        throw new Error(
          `${!projectToken ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'VITE_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'VITE_PUBLIC_POSTHOG_HOST'} is configured`
        )
      }

      return
    }

    void Promise.all([import('posthog-js'), import('@posthog/react')]).then(
      ([{ default: posthog }, { PostHogErrorBoundary: ErrorBoundary, PostHogProvider: Provider }]) => {
        posthog.init(projectToken, {
          api_host: host,
          defaults: '2026-01-30',
        })
        posthogClient = posthog
        PostHogProvider = Provider
        PostHogErrorBoundary = ErrorBoundary
        setIsInitialized(true)
      }
    )
  }, [])

  return isInitialized && posthogClient && PostHogProvider && PostHogErrorBoundary ? (
    <PostHogProvider client={posthogClient}>
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </PostHogProvider>
  ) : (
    children
  )
}
