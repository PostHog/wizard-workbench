'use client'

import NextError from 'next/error'
import posthog from 'posthog-js'
import { useEffect } from 'react'

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const missingPostHogVariable = !posthogToken
  ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
  : !posthogHost
    ? 'NEXT_PUBLIC_POSTHOG_HOST'
    : undefined

if (missingPostHogVariable && process.env.NODE_ENV === 'development') {
  throw new Error(
    `${missingPostHogVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingPostHogVariable} is configured`
  )
}

if (posthogToken && posthogHost && !posthog.__loaded) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: '2026-01-30',
    debug: process.env.NODE_ENV === 'development',
  })
}

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    if (posthogToken && posthogHost) {
      posthog.captureException(error)
    }
  }, [error])

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
