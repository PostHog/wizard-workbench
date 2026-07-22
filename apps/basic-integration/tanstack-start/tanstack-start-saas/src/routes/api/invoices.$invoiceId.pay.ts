import { createFileRoute } from '@tanstack/react-router'
import { updateInvoice, getInvoiceById } from '~/utils/invoices'
import { getPostHogClient } from '~/utils/posthog-server'

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

        const posthog = getPostHogClient()
        if (posthog) {
          posthog.capture({
            event: 'invoice_marked_paid',
            properties: {
              invoice_id: invoice?.id,
              amount: invoice?.amount,
              source: 'api',
            },
          })
          await posthog.flush()
        }

        return Response.json(invoice)
      },
    },
  },
})
