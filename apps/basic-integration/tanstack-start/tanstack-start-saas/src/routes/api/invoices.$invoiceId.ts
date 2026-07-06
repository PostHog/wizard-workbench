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

          getPostHogClient().capture({
            distinctId: `invoice:${invoice.id}`,
            event: 'invoice_updated_api',
            properties: {
              invoice_id: invoice.id,
              invoice_status: invoice.status,
              amount: invoice.amount,
              source: 'api',
            },
          })

          return Response.json(invoice)
        } catch (e) {
          getPostHogClient().captureException(e)
          console.error('Error updating invoice:', e)
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

        const invoice = getInvoiceById(id)
        const deleted = deleteInvoice(id)

        if (!deleted || !invoice) {
          return Response.json({ error: 'Invoice not found' }, { status: 404 })
        }

        getPostHogClient().capture({
          distinctId: `invoice:${invoice.id}`,
          event: 'invoice_deleted_api',
          properties: {
            invoice_id: invoice.id,
            invoice_status: invoice.status,
            amount: invoice.amount,
            source: 'api',
          },
        })

        return Response.json({ success: true })
      },
    },
  },
})
