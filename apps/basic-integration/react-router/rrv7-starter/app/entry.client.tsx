import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (!projectToken || !apiHost) {
  if (import.meta.env.DEV) {
    const missingVariable = projectToken ? 'VITE_PUBLIC_POSTHOG_HOST' : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    )
  }
} else {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: '2026-01-30',
    logs: {
      serviceName: 'clouthub-web',
      environment: import.meta.env.MODE,
    },
  })
}

const app =
  projectToken && apiHost ? (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <HydratedRouter />
      </PostHogErrorBoundary>
    </PostHogProvider>
  ) : (
    <HydratedRouter />
  )

startTransition(() => {
  hydrateRoot(document, <StrictMode>{app}</StrictMode>)
})
