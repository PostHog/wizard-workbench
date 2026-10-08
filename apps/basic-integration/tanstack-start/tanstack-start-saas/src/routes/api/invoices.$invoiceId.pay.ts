import { createFileRoute } from '@tanstack/react-router'
import { updateInvoice, getInvoiceById } from '~/utils/invoices'
import {
  capturePostHogServerEvent,
  logPostHogIntegration,
} from '~/utils/posthog-logs.server'

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

        await capturePostHogServerEvent(request, 'invoice_marked_paid', {
          invoice_id: invoice?.id,
          invoice_amount: invoice?.amount,
        })
        await logPostHogIntegration('invoice_marked_paid')

        return Response.json(invoice)
      },
    },
  },
})
