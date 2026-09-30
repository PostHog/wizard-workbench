import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST
let app = <HydratedRouter />

if (!posthogKey) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured'
    )
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'
    )
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
  })
  app = (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>{app}</PostHogErrorBoundary>
    </PostHogProvider>
  )
}

startTransition(() => {
  hydrateRoot(document, <StrictMode>{app}</StrictMode>)
})
