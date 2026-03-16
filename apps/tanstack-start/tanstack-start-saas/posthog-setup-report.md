# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration includes client-side analytics via `@posthog/react` with automatic pageview tracking, session recording, and exception capture, as well as server-side event capture using `posthog-node` in the API routes.

## Changes made

### New files
- `src/utils/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node`

### Modified files
- `vite.config.ts` — Added `/ingest` reverse proxy to route PostHog traffic through the dev server, avoiding ad-blockers
- `src/routes/__root.tsx` — Added `PostHogProvider` from `@posthog/react` to initialize PostHog for all client-side routes
- `src/routes/posts.index.tsx` — Added `invoice_created` event on form submit
- `src/routes/posts.$postId.tsx` — Added `invoice_paid` event on mark as paid
- `src/routes/posts_.$postId.deep.tsx` — Added `invoice_paid` and `invoice_pdf_downloaded` events
- `src/routes/api/invoices.$invoiceId.pay.ts` — Added server-side `invoice_paid_server` event
- `src/routes/api/invoices.ts` — Added server-side `invoice_created_server` event on POST
- `src/routes/api/invoices.$invoiceId.ts` — Added server-side `invoice_deleted_server` event on DELETE

### Environment variables
Added to `.env`:
- `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` — PostHog project token
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog host URL

## Events

| Event name | Description | File |
|---|---|---|
| `invoice_created` | Fired on the client when a user successfully creates a new invoice | `src/routes/posts.index.tsx` |
| `invoice_paid` | Fired on the client when a user clicks Mark as Paid on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | Fired on the client when a user clicks Mark as Paid on the deep invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | Fired when a user clicks the Download PDF button | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid_server` | Server-side event fired when an invoice is successfully marked as paid via the API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Server-side event fired when an invoice is successfully created via the API | `src/routes/api/invoices.ts` |
| `invoice_deleted_server` | Server-side event fired when an invoice is successfully deleted via the API | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to your [PostHog project](https://us.i.posthog.com/project/2) and create a new dashboard with these insights:

1. **Invoice creation funnel** — Funnel: `invoice_created` → `invoice_paid` — shows what percentage of created invoices get paid
2. **Invoice creation trend** — Trend line for `invoice_created` over time — tracks business growth
3. **Invoice payment trend** — Trend line for `invoice_paid` and `invoice_paid_server` — monitors payment activity
4. **PDF download rate** — Trend line for `invoice_pdf_downloaded` — usage of the PDF feature
5. **Invoice deletion rate** — Trend line for `invoice_deleted_server` — tracks churn/cancellations

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
