import type { ReactNode } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

function requirePostHogEnvironmentVariable(name: string, value: string | undefined) {
  if (!value && import.meta.env.DEV) {
    throw new Error(
      `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`,
    )
  }
}

requirePostHogEnvironmentVariable('VITE_PUBLIC_POSTHOG_PROJECT_TOKEN', apiKey)
requirePostHogEnvironmentVariable('VITE_PUBLIC_POSTHOG_HOST', apiHost)

const isConfigured = Boolean(apiKey && apiHost)

if (isConfigured) {
  posthog.init(apiKey, {
    api_host: apiHost,
    capture_exceptions: true,
    debug: import.meta.env.DEV,
    defaults: '2026-01-30',
  })
}

export function PostHogRoot({ children }: { children: ReactNode }) {
  if (!isConfigured) {
    return children
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
