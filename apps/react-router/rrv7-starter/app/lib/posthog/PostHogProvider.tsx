'use client'

import { useEffect } from 'react'
import { useLocation } from 'react-router'
import posthog from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    // Initialize PostHog only on the client side
    if (typeof window !== 'undefined') {
      const apiKey = import.meta.env.VITE_POSTHOG_API_KEY
      const host = import.meta.env.VITE_POSTHOG_HOST

      if (apiKey && host) {
        posthog.init(apiKey, {
          api_host: host,
          person_profiles: 'identified_only',
          capture_pageview: false, // We'll capture pageviews manually for SPA routing
          capture_pageleave: true,
        })
      }
    }
  }, [])

  // Track pageviews on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      })
    }
  }, [location.pathname])

  return <>{children}</>
}
