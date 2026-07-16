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
          const distinctId = request.headers.get('X-PostHog-Distinct-Id')

          if (distinctId) {
            const posthog = getPostHogClient()
            posthog.capture({
              distinctId,
              event: 'invoice_created',
              properties: {
                $session_id:
                  request.headers.get('X-PostHog-Session-Id') || undefined,
                invoice_id: invoice.id,
                invoice_amount: invoice.amount,
                has_description: Boolean(invoice.description),
                source: 'api',
              },
            })
            await posthog.flush()
          }

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
