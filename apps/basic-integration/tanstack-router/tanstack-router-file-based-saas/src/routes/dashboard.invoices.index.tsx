import { createFileRoute, useRouter } from '@tanstack/react-router'
import { InvoiceFields } from '../components/InvoiceFields'
import { Spinner } from '../components/Spinner'
import { useMutation } from '../hooks/useMutation'
import { postInvoice } from '../utils/mockTodos'
import type { Invoice } from '../utils/mockTodos'
import posthog from '../posthog'

export const Route = createFileRoute('/dashboard/invoices/')({
  component: InvoicesIndexComponent,
})

function InvoicesIndexComponent() {
  const router = useRouter()

  const createInvoiceMutation = useMutation({
    fn: postInvoice,
    onSuccess: ({ data: invoice }) => {
      posthog.capture('invoice_created', { invoice_id: invoice.id })
      return router.invalidate()
    },
  })

  return (
    <div className="p-6">
      <div className="max-w-xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Create New Invoice</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fill out the details below to create a new invoice for your client.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            const formData = new FormData(event.target as HTMLFormElement)
            createInvoiceMutation.mutate({
              title: formData.get('title') as string,
              body: formData.get('body') as string,
            })
          }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4"
        >
          <InvoiceFields invoice={{} as Invoice} />

          <div className="flex items-center gap-3 pt-2">
            <button
              className="px-6 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={createInvoiceMutation.status === 'pending'}
            >
              {createInvoiceMutation.status === 'pending' ? (
                <span className="flex items-center gap-2">
                  Creating <Spinner />
                </span>
              ) : (
                'Create Invoice'
              )}
            </button>

            {createInvoiceMutation.status === 'success' ? (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                Invoice created successfully!
              </div>
            ) : createInvoiceMutation.status === 'error' ? (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                Failed to create invoice.
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}
