import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { NotFound } from '~/components/NotFound'
import { PostErrorComponent } from '~/components/PostError'
import { fetchInvoice, markInvoicePaid } from '~/utils/invoices'

export const Route = createFileRoute('/posts_/$postId/deep')({
  loader: ({ params: { postId } }) => fetchInvoice({ data: postId }),
  errorComponent: PostErrorComponent,
  component: PostDeepComponent,
})

function PostDeepComponent() {
  const invoice = Route.useLoaderData()
  const router = useRouter()

  const handleMarkAsPaid = async () => {
    await markInvoicePaid({ data: String(invoice.id) })
    router.invalidate()
  }

  if (!invoice) {
    return <NotFound>Invoice not found</NotFound>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          to="/posts"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <span>←</span>
          Back to Invoices
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  INV-{String(invoice.id).padStart(4, '0')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{invoice.title}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {invoice.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Amount
              </p>
              <p className="text-3xl font-bold">
                ${(invoice.amount ?? 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Due Date
              </p>
              <p className="text-xl font-semibold">
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Created
              </p>
              <p className="text-xl font-semibold">
                {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="font-semibold mb-3">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {invoice.description}
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
            {invoice.status === 'pending' && (
              <button
                onClick={handleMarkAsPaid}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Paid
              </button>
            )}
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
