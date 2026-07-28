import type { ReactNode } from 'react'
import { PostHogProvider } from '@posthog/react'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

function validateConfiguration() {
  if (projectToken && host) return true

  if (import.meta.env.DEV) {
    const missingVariable = projectToken
      ? 'VITE_PUBLIC_POSTHOG_HOST'
      : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
  }

  return false
}

export function PostHogRoot({ children }: { children: ReactNode }) {
  if (!validateConfiguration()) return <>{children}</>

  return (
    <PostHogProvider
      apiKey={projectToken}
      options={{
        api_host: host,
        defaults: '2026-01-30',
        capture_exceptions: true,
        debug: import.meta.env.DEV,
      }}
    >
      {children}
    </PostHogProvider>
  )
}
