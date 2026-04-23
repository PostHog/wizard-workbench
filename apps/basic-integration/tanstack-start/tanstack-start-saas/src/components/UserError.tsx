import { ErrorComponent, Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function UserErrorComponent({ error }: ErrorComponentProps) {
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
