import { useEffect } from 'react'

export function PostHogInit() {
  useEffect(() => {
    void import('@/lib/posthog.client').then(({ initializePostHog }) => initializePostHog())
  }, [])

  return null
}
