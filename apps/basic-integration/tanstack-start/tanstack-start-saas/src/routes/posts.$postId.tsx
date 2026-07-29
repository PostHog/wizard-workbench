import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import { NotFound } from '~/components/NotFound'
import { PostErrorComponent } from '~/components/PostError'
import { fetchInvoice, markInvoicePaid } from '~/utils/invoices'

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params: { postId } }) => fetchInvoice({ data: postId }),
  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Invoice not found</NotFound>
  },
})

function PostComponent() {
  const invoice = Route.useLoaderData()
  const router = useRouter()
  const posthog = usePostHog()

  const handleMarkAsPaid = async () => {
    const paidInvoice = await markInvoicePaid({ data: String(invoice.id) })
    posthog.capture('invoice_marked_paid', {
      invoice_id: paidInvoice.id,
      amount: paidInvoice.amount,
    })
    router.invalidate()
  }

  if (!invoice) {
    return <NotFound>Invoice not found</NotFound>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            INV-{String(invoice.id).padStart(4, '0')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {invoice.title}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            invoice.status === 'paid'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
          <p className="text-2xl font-bold">
            ${(invoice.amount ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
          <p className="text-2xl font-bold">
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-600 dark:text-gray-400">{invoice.description}</p>
      </div>

      <div className="mt-6 flex gap-3">
        {invoice.status === 'pending' && (
          <button
            onClick={handleMarkAsPaid}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark as Paid
          </button>
        )}
        <Link
          to="/posts/$postId/deep"
          params={{
            postId: String(invoice.id),
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Full Details
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
