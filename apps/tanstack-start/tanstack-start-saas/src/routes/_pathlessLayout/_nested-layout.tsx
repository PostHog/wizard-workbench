import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_pathlessLayout/_nested-layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div>
      <div className="flex border-b dark:border-gray-700">
        <Link
          to="/route-a"
          className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent transition-colors"
          activeProps={{
            className:
              'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium',
          }}
        >
          Profile
        </Link>
        <Link
          to="/route-b"
          className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent transition-colors"
          activeProps={{
            className:
              'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-medium',
          }}
        >
          Notifications
        </Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
