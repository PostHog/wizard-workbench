import { useEffect } from 'react'

import { getPostHog } from '@/lib/posthog.client'

export function PostHogInitializer() {
  useEffect(() => {
    void getPostHog()
  }, [])

  return null
}
