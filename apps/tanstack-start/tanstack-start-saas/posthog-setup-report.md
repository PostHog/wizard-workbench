<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. PostHog is now initialized client-side via `PostHogProvider` in the root shell component, with a server-side singleton client (`posthog-node`) for tracking critical business events from API routes. A Vite reverse proxy routes PostHog ingestion requests through `/ingest` to avoid CORS issues.

| Event Name | Description | File |
|---|---|---|
| `invoice_mark_paid_clicked` | User clicked the "Mark as Paid" button on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_mark_paid_clicked` | User clicked the "Mark as Paid" button on the invoice full details page (with `source: 'deep'` property) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicked the "Download PDF" button on the invoice full details page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid` | Server-side: invoice was successfully marked as paid via the pay API endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Server-side: a new invoice was successfully created via the invoices API | `src/routes/api/invoices.ts` |

Error tracking (`posthog.captureException`) was also added around the `markInvoicePaid` server function calls in both invoice detail views, and `capture_exceptions: true` is set globally in the `PostHogProvider` options to automatically capture unhandled exceptions.

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key business metrics:

1. **Invoice payment rate (funnel)** — Funnel from `invoice_mark_paid_clicked` → `invoice_paid`. Tracks how many payment button clicks result in a successful server-side payment.

2. **Invoices paid over time (trend)** — Trend chart of `invoice_paid` events, grouped by day or week. Monitors payment activity volume.

3. **Invoices created over time (trend)** — Trend chart of `invoice_created` events. Tracks new invoice creation velocity.

4. **PDF download rate** — Trend of `invoice_pdf_downloaded` events. Understand how often users export invoices.

5. **Payment source breakdown** — `invoice_mark_paid_clicked` broken down by the `source` property (`deep` vs default detail view). Shows which UI surface drives more payment actions.

To create these in PostHog:
1. Go to your PostHog project → **Dashboards** → **New dashboard** → name it "Analytics basics"
2. Add each insight using **+ New insight** inside the dashboard
3. Use the **Trends** or **Funnels** insight type as noted above, and filter by the event names listed

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
