import { useEffect } from 'react'
import { useLocation } from 'react-router'
import posthog from 'posthog-js'

interface PostHogProviderProps {
  children: React.ReactNode
  apiKey: string
  host: string
}

export function PostHogProvider({ children, apiKey, host }: PostHogProviderProps) {
  const location = useLocation()

  // Initialize PostHog on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll manually capture pageviews to handle SPA navigation
        capture_pageleave: true,
      })
    }
  }, [apiKey, host])

  // Track pageviews on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('$pageview')
    }
  }, [location.pathname])

  return <>{children}</>
}

export { posthog }
