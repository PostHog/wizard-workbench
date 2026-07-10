import { createFileRoute } from '@tanstack/react-router'
import { updateInvoice, getInvoiceById } from '~/utils/invoices'
import { getPostHogClient } from '~/utils/posthog-server'

export const Route = createFileRoute('/api/invoices/$invoiceId/pay')({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        console.info(`POST /api/invoices/${params.invoiceId}/pay @`, request.url)
        const id = Number(params.invoiceId)

        getPostHogClient().capture({
          distinctId: 'anonymous',
          event: 'invoice_payment_api_called',
          properties: {
            invoice_id: params.invoiceId,
            source: 'api',
          },
        })

        if (isNaN(id)) {
          return Response.json({ error: 'Invalid invoice ID' }, { status: 400 })
        }

        const existing = getInvoiceById(id)

        if (!existing) {
          return Response.json({ error: 'Invoice not found' }, { status: 404 })
        }

        if (existing.status === 'paid') {
          return Response.json(
            { error: 'Invoice is already paid' },
            { status: 400 }
          )
        }

        const invoice = updateInvoice(id, { status: 'paid' })

        if (invoice) {
          getPostHogClient().capture({
            distinctId: `invoice-${invoice.id}`,
            event: 'invoice_paid_api',
            properties: {
              invoice_id: invoice.id,
              amount: invoice.amount,
              status: invoice.status,
              source: 'api',
            },
          })
        }

        return Response.json(invoice)
      },
    },
  },
})
