import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (!projectToken && import.meta.env.DEV) {
  throw new Error(
    'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
  )
}

if (!host && import.meta.env.DEV) {
  throw new Error(
    'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
  )
}

const isPostHogConfigured = Boolean(projectToken && host)

if (projectToken && host) {
  posthog.init(projectToken, {
    api_host: host,
    defaults: '2026-05-30',
  })
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      {isPostHogConfigured ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary>
            <HydratedRouter />
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        <HydratedRouter />
      )}
    </StrictMode>
  )
})
