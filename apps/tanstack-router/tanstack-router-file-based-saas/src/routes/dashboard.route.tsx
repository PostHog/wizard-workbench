import { createFileRoute, Link, Outlet, linkOptions } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
  loader: () => ({
    crumb: 'Dashboard',
  }),
})

const options = [
  linkOptions({
    to: '/dashboard',
    label: 'Overview',
    icon: '📊',
    activeOptions: { exact: true },
  }),
  linkOptions({
    to: '/dashboard/invoices',
    label: 'Invoices',
    icon: '📄',
  }),
  linkOptions({
    to: '/dashboard/users',
    label: 'Team',
    icon: '👥',
  }),
]

function DashboardComponent() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex gap-1 px-6 pt-4 bg-gray-50 dark:bg-gray-800/30 border-b">
        {options.map((option) => {
          return (
            <Link
              key={option.to}
              {...option}
              activeProps={{
                className: `border-blue-600 text-blue-600 dark:text-blue-400`,
              }}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-900 dark:hover:text-gray-200 transition-colors -mb-px"
            >
              <span>{option.icon}</span>
              {option.label}
            </Link>
          )
        })}
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
