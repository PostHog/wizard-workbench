import { createFileRoute, Link } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'

import { fetchInvoices } from '../utils/mockTodos'

export const Route = createFileRoute('/dashboard/')({
  loader: () => fetchInvoices(),
  component: DashboardIndexComponent,
})

function DashboardIndexComponent() {
  const posthog = usePostHog()
  const invoices = Route.useLoaderData()

  const totalRevenue = invoices.length * 1250
  const pendingCount = Math.floor(invoices.length * 0.3)
  const paidCount = invoices.length - pendingCount

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-1">Welcome back!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your business performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Invoices</div>
          <div className="text-2xl font-bold">{invoices.length}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenue</div>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last month</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          <div className="text-xs text-gray-500 mt-1">{Math.round((paidCount / invoices.length) * 100)}% of total</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-xs text-gray-500 mt-1">{Math.round((pendingCount / invoices.length) * 100)}% of total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Quick Actions</h4>
          <div className="space-y-2">
            <Link
              to="/dashboard/invoices"
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => posthog.capture('dashboard_quick_action_clicked', { action: 'create_invoice' })}
            >
              <span className="text-xl">📄</span>
              <div>
                <div className="font-medium">Create Invoice</div>
                <div className="text-sm text-gray-500">Bill your clients</div>
              </div>
            </Link>
            <Link
              to="/dashboard/users"
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => posthog.capture('dashboard_quick_action_clicked', { action: 'manage_team' })}
            >
              <span className="text-xl">👥</span>
              <div>
                <div className="font-medium">Manage Team</div>
                <div className="text-sm text-gray-500">View team members</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
          <h4 className="font-medium mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {invoices.slice(0, 4).map((invoice, i) => (
              <div key={invoice.id} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                <div className="flex-1 truncate">{invoice.title}</div>
                <div className="text-gray-500">{i % 2 === 0 ? 'Paid' : 'Pending'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
