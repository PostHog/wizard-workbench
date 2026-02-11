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

        // Track server-side invoice payment completion - critical conversion event
        const sessionId = request.headers.get('X-PostHog-Session-Id')
        const distinctId = request.headers.get('X-PostHog-Distinct-Id') || 'anonymous'
        const posthog = getPostHogClient()
        posthog.capture({
          distinctId,
          event: 'invoice_payment_completed',
          properties: {
            $session_id: sessionId || undefined,
            invoice_id: invoice?.id,
            invoice_title: invoice?.title,
            invoice_amount: invoice?.amount,
            source: 'api',
          },
        })

        return Response.json(invoice)
      },
    },
  },
})
