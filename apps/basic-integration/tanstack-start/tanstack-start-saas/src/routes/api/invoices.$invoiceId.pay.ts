import { createFileRoute } from '@tanstack/react-router'
import { updateInvoice, getInvoiceById } from '~/utils/invoices'
import { capturePostHogEvent } from '~/utils/posthog-server'

export const Route = createFileRoute('/api/invoices/$invoiceId/pay')({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        console.info(`POST /api/invoices/${params.invoiceId}/pay @`, request.url)
        const id = Number(params.invoiceId)

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

        await capturePostHogEvent('invoice_paid', {
          source: 'api',
          invoice_amount: invoice?.amount ?? 0,
        })

        return Response.json(invoice)
      },
    },
  },
})
