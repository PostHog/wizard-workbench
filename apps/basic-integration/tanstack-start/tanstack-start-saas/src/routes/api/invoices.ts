import { createFileRoute } from '@tanstack/react-router'
import { getAllInvoices, createInvoice } from '~/utils/invoices'
import { getPostHogClient } from '~/utils/posthog-server'

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

          const sessionId = request.headers.get('X-PostHog-Session-Id')
          const distinctId = request.headers.get('X-PostHog-Distinct-Id')
          const posthog = getPostHogClient()
          posthog.capture({
            distinctId: distinctId || `invoice-${invoice.id}`,
            event: 'invoice_created_api',
            properties: {
              $session_id: sessionId || undefined,
              invoice_id: invoice.id,
              invoice_title: invoice.title,
              invoice_amount: invoice.amount,
              source: 'api',
            },
          })

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
