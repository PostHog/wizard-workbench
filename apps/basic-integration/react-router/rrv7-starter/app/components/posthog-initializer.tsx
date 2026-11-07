import { useEffect } from 'react'

import { getPostHog } from '@/lib/posthog'

export function PostHogInitializer() {
  useEffect(() => {
    void getPostHog()
  }, [])

  return null
}
