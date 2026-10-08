import { createFileRoute } from '@tanstack/react-router'
import { getAllInvoices, createInvoice } from '~/utils/invoices'
import {
  capturePostHogServerEvent,
  logPostHogIntegration,
} from '~/utils/posthog-logs.server'

export const Route = createFileRoute('/api/invoices')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.info('GET /api/invoices @', request.url)
        const invoices = getAllInvoices()
        return Response.json(invoices)
      },

      POST: async ({ request }) => {
        console.info('POST /api/invoices @', request.url)
        try {
          const body = await request.json()

          // Validate required fields
          if (!body.title || !body.amount || !body.dueDate) {
            return Response.json(
              { error: 'Missing required fields: title, amount, dueDate' },
              { status: 400 }
            )
          }

          const invoice = createInvoice({
            title: body.title,
            description: body.description || '',
            amount: Number(body.amount),
            dueDate: body.dueDate,
          })

          await capturePostHogServerEvent(request, 'invoice_created', {
            invoice_amount: invoice.amount,
            has_description: Boolean(invoice.description),
          })
          await logPostHogIntegration('invoice_created')

          return Response.json(invoice, { status: 201 })
        } catch (e) {
          console.error('Error creating invoice:', e)
          return Response.json(
            { error: 'Failed to create invoice' },
            { status: 500 }
          )
        }
      },
    },
  },
})
