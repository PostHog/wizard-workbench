import { ErrorComponent, Link } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import { useRef } from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function UserErrorComponent({ error }: ErrorComponentProps) {
  const posthog = usePostHog()
  const hasReportedError = useRef(false)

  // Capture error in PostHog once
  if (!hasReportedError.current) {
    hasReportedError.current = true
    posthog.captureException(error)
    posthog.capture('user_error', {
      error_message: error instanceof Error ? error.message : String(error),
      error_name: error instanceof Error ? error.name : 'Unknown',
      error_context: 'team_member',
    })
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">👤</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">Team Member Error</h3>
      <div className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        <ErrorComponent error={error} />
      </div>
      <Link
        to="/users"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Team
      </Link>
    </div>
  )
}
