'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { initPostHog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()

    fetch('/api/user')
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user?.id) {
          posthog.identify(String(user.id), {
            email: user.email,
            name: user.name,
          })
        }
      })
      .catch(() => {})
  }, [])

  return <>{children}</>
}
