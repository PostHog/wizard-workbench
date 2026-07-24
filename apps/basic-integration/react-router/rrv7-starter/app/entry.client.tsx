import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'

const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (!token) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    )
  }
} else {
  posthog.init(token, {
    api_host: host ?? 'https://us.i.posthog.com',
    defaults: '2026-01-30',
    tracing_headers: [window.location.hostname],
  })
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
