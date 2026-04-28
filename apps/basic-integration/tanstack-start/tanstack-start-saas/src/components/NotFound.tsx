import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">Not Found</h3>
      <div className="text-gray-600 dark:text-gray-400 mb-6">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
