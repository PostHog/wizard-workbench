import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { PostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    capture_exceptions: true,
    defaults: '2026-08-30',
    tracing_headers: [window.location.hostname],
  })
} else if (import.meta.env.DEV) {
  if (!posthogToken) {
    console.error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    )
  }

  if (!posthogHost) {
    console.error(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
    )
  }
}

startTransition(() => {
  hydrateRoot(
    document,
    <PostHogProvider client={posthog}>
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    </PostHogProvider>
  )
})
