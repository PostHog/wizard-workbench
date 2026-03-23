<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration includes both client-side and server-side event tracking, session replay, exception capture, and a reverse proxy configuration for reliable ingestion.

## Changes made

### New files
- **`src/utils/posthog-server.ts`** — Singleton server-side PostHog client using `posthog-node`
- **`.env`** — PostHog environment variables (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`)

### Modified files
- **`vite.config.ts`** — Added `/ingest` reverse proxy to route PostHog events through the dev server
- **`src/routes/__root.tsx`** — Wrapped app shell with `PostHogProvider` for client-side tracking (pageviews, session replay, exception capture)
- **`src/routes/index.tsx`** — Added `home_cta_clicked` event on primary CTA buttons
- **`src/routes/posts.$postId.tsx`** — Added `invoice_mark_paid_clicked` and `invoice_view_details_clicked` events
- **`src/routes/posts_.$postId.deep.tsx`** — Added `invoice_mark_paid_clicked` and `invoice_pdf_download_clicked` events
- **`src/routes/api/invoices.ts`** — Added server-side `invoice_created` event
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added server-side `invoice_paid` event (critical payment conversion)
- **`src/routes/api/invoices.$invoiceId.ts`** — Added server-side `invoice_updated` and `invoice_deleted` events

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | Fired server-side when a new invoice is created via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_paid` | Fired server-side when an invoice is paid via POST /api/invoices/$invoiceId/pay — critical payment event | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted` | Fired server-side when an invoice is deleted via DELETE /api/invoices/$invoiceId | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_updated` | Fired server-side when an invoice is updated via PATCH /api/invoices/$invoiceId | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_mark_paid_clicked` | Fired client-side when the user clicks "Mark as Paid" on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_mark_paid_clicked` | Fired client-side when the user clicks "Mark as Paid" on the full details page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_view_details_clicked` | Fired client-side when user clicks "View Full Details" to navigate to the deep invoice view | `src/routes/posts.$postId.tsx` |
| `invoice_pdf_download_clicked` | Fired client-side when the user clicks "Download PDF" on the full details page | `src/routes/posts_.$postId.deep.tsx` |
| `home_cta_clicked` | Fired client-side when a primary CTA button is clicked on the home page | `src/routes/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1228088) — Core analytics for CloudFlow with invoice lifecycle trends, payment conversion funnel, and CTA performance
- [Invoice Lifecycle Trends](https://us.posthog.com/project/238460/insight/L6wSgKSY) — Daily trends of invoice creation, payments, and deletions
- [Invoice Payment Conversion Funnel](https://us.posthog.com/project/238460/insight/biJXbnuI) — Funnel from invoice view to payment completion
- [CTA Performance by Button](https://us.posthog.com/project/238460/insight/kOdeXEeO) — Breakdown of home page CTA clicks
- [Error Tracking Overview](https://us.posthog.com/project/238460/insight/aJI8NBVE) — Exception monitoring
- [Team Member Engagement](https://us.posthog.com/project/238460/insight/0wya2EZ3) — User engagement with team management features

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
