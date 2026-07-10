import { createFileRoute } from '@tanstack/react-router'
import { getAllInvoices, createInvoice } from '~/utils/invoices'
import { getPostHogClient } from '~/utils/posthog-server'

export const Route = createFileRoute('/api/invoices')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.info('GET /api/invoices @', request.url)
        const invoices = getAllInvoices()

        getPostHogClient().capture({
          distinctId: 'anonymous',
          event: 'api_invoices_listed',
          properties: {
            invoice_count: invoices.length,
            source: 'api',
          },
        })

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

          getPostHogClient().capture({
            distinctId: `invoice-${invoice.id}`,
            event: 'invoice_created_api',
            properties: {
              invoice_id: invoice.id,
              amount: invoice.amount,
              has_description: Boolean(invoice.description),
              status: invoice.status,
              source: 'api',
            },
          })

          return Response.json(invoice, { status: 201 })
        } catch (e) {
          console.error('Error creating invoice:', e)
          getPostHogClient().captureException(e, 'anonymous', {
            source: 'api',
            operation: 'create_invoice',
          })
          return Response.json(
            { error: 'Failed to create invoice' },
            { status: 500 }
          )
        }
      },
    },
  },
})
