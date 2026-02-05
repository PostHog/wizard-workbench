import { createFileRoute, Link, MatchRoute, Outlet } from '@tanstack/react-router'
import { Spinner } from '../components/Spinner'
import { fetchInvoices } from '../utils/mockTodos'

export const Route = createFileRoute('/dashboard/invoices')({
  loader: () => fetchInvoices(),
  component: InvoicesComponent,
})

function InvoicesComponent() {
  const invoices = Route.useLoaderData()

  return (
    <div className="flex-1 flex h-full">
      <div className="w-64 bg-gray-50 dark:bg-gray-800/30 border-r overflow-auto">
        <div className="p-4 border-b">
          <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            All Invoices
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.map((invoice, i) => {
            const isPaid = i % 2 === 0
            return (
              <Link
                key={invoice.id}
                to="/dashboard/invoices/$invoiceId"
                params={{ invoiceId: invoice.id }}
                preload="intent"
                className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                activeProps={{ className: `bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-600` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">INV-{String(invoice.id).padStart(4, '0')}</span>
                  <MatchRoute
                    to="/dashboard/invoices/$invoiceId"
                    params={{ invoiceId: invoice.id }}
                    pending
                  >
                    {(match) => <Spinner show={!!match} wait="delay-50" />}
                  </MatchRoute>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                  {invoice.title}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">${(invoice.id * 125).toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isPaid
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
