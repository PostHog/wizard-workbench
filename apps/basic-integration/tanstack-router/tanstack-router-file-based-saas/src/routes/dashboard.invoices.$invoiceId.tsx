import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import * as React from 'react'
import { z } from 'zod'
import { InvoiceFields } from '../components/InvoiceFields'
import { useMutation } from '../hooks/useMutation'
import { fetchInvoiceById, patchInvoice } from '../utils/mockTodos'

export const Route = createFileRoute('/dashboard/invoices/$invoiceId')({
  params: {
    parse: (params) => ({
      invoiceId: z.number().int().parse(Number(params.invoiceId)),
    }),
    stringify: ({ invoiceId }) => ({ invoiceId: `${invoiceId}` }),
  },
  validateSearch: (search) =>
    z
      .object({
        showNotes: z.boolean().optional(),
        notes: z.string().optional(),
      })
      .parse(search),
  loader: ({ params: { invoiceId } }) => fetchInvoiceById(invoiceId),
  component: InvoiceComponent,
})

function InvoiceComponent() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const invoice = Route.useLoaderData()
  const router = useRouter()
  const posthog = usePostHog()
  const updateInvoiceMutation = useMutation({
    fn: patchInvoice,
    onSuccess: () => router.invalidate(),
  })
  const [notes, setNotes] = React.useState(search.notes ?? '')

  React.useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        notes: notes ? notes : undefined,
      }),
      replace: true,
      params: true,
    })
  }, [notes])

  const isPaid = invoice.id % 2 === 0
  const amount = invoice.id * 125

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">
              Invoice INV-{String(invoice.id).padStart(4, '0')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created on {new Date().toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPaid
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {isPaid ? 'Paid' : 'Pending'}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</div>
              <div className="text-2xl font-bold">${amount.toLocaleString()}.00</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</div>
              <div className="text-lg font-medium">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <form
          key={invoice.id}
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            const formData = new FormData(event.target as HTMLFormElement)
            posthog.capture('invoice_update_submitted', {
              invoice_id: invoice.id,
            })
            updateInvoiceMutation.mutate({
              id: invoice.id,
              title: formData.get('title') as string,
              body: formData.get('body') as string,
            })
          }}
          className="space-y-4"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
            <h4 className="font-medium mb-4">Invoice Details</h4>
            <InvoiceFields
              invoice={invoice}
              disabled={updateInvoiceMutation.status === 'pending'}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Internal Notes</h4>
              <Link
                from={Route.fullPath}
                search={(old) => ({
                  ...old,
                  showNotes: !old.showNotes || undefined,
                })}
                onClick={() => {
                  posthog.capture('invoice_notes_toggled', {
                    invoice_id: invoice.id,
                    notes_visible: !search.showNotes,
                  })
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                params={true}
              >
                {search.showNotes ? 'Hide Notes' : 'Add Notes'}
              </Link>
            </div>
            {search.showNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Add internal notes about this invoice..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Notes are saved in the URL for easy sharing with your team.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click "Add Notes" to attach internal notes to this invoice.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-6 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={updateInvoiceMutation.status === 'pending'}
            >
              Save Changes
            </button>

            {updateInvoiceMutation.variables?.id === invoice.id ? (
              <div key={updateInvoiceMutation.submittedAt}>
                {updateInvoiceMutation.status === 'success' ? (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                    Changes saved!
                  </div>
                ) : updateInvoiceMutation.status === 'error' ? (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                    Failed to save changes.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}
