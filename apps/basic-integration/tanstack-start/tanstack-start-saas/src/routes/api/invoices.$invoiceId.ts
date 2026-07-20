import { createFileRoute } from '@tanstack/react-router'
import { getInvoiceById, updateInvoice, deleteInvoice } from '~/utils/invoices'
import { getPostHogClient } from '~/utils/posthog-server'

export const Route = createFileRoute('/api/invoices/$invoiceId')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        console.info(`GET /api/invoices/${params.invoiceId} @`, request.url)
        const id = Number(params.invoiceId)

        if (isNaN(id)) {
          return Response.json({ error: 'Invalid invoice ID' }, { status: 400 })
        }

        const invoice = getInvoiceById(id)

        if (!invoice) {
          return Response.json({ error: 'Invoice not found' }, { status: 404 })
        }

        return Response.json(invoice)
      },

      PATCH: async ({ params, request }) => {
        console.info(`PATCH /api/invoices/${params.invoiceId} @`, request.url)
        const id = Number(params.invoiceId)

        if (isNaN(id)) {
          return Response.json({ error: 'Invalid invoice ID' }, { status: 400 })
        }

        try {
          const body = await request.json()
          const invoice = updateInvoice(id, body)

          if (!invoice) {
            return Response.json({ error: 'Invoice not found' }, { status: 404 })
          }

          const posthog = getPostHogClient()
          posthog.capture({
            distinctId: `invoice:${invoice.id}`,
            event: 'invoice_updated',
            properties: {
              invoice_id: invoice.id,
              amount: invoice.amount,
              status: invoice.status,
              source: 'api',
            },
          })
          await posthog.flush()

          return Response.json(invoice)
        } catch (e) {
          console.error('Error updating invoice:', e)
          const posthog = getPostHogClient()
          posthog.captureException(e)
          await posthog.flush()
          return Response.json(
            { error: 'Failed to update invoice' },
            { status: 500 }
          )
        }
      },

      DELETE: async ({ params, request }) => {
        console.info(`DELETE /api/invoices/${params.invoiceId} @`, request.url)
        const id = Number(params.invoiceId)

        if (isNaN(id)) {
          return Response.json({ error: 'Invalid invoice ID' }, { status: 400 })
        }

        const deleted = deleteInvoice(id)

        if (!deleted) {
          return Response.json({ error: 'Invoice not found' }, { status: 404 })
        }

        const posthog = getPostHogClient()
        posthog.capture({
          distinctId: `invoice:${id}`,
          event: 'invoice_deleted',
          properties: {
            invoice_id: id,
            source: 'api',
          },
        })
        await posthog.flush()

        return Response.json({ success: true })
      },
    },
  },
})
