import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { fetchInvoices } from '../utils/invoices'

export const Route = createFileRoute('/posts')({
  loader: () => fetchInvoices(),
  component: PostsComponent,
})

function PostsComponent() {
  const invoices = Route.useLoaderData() ?? []

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Link
          to="/posts"
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Invoice
        </Link>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 bg-gray-50 dark:bg-gray-800/30 border-r overflow-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              All Invoices ({invoices.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                to="/posts/$postId"
                params={{ postId: String(invoice.id) }}
                className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                activeProps={{
                  className:
                    'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-600',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">
                    INV-{String(invoice.id).padStart(4, '0')}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                  {invoice.title}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    ${(invoice.amount ?? 0).toLocaleString()}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
