<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this TanStack Start (CloudFlow) application. The following changes were made:

- **`src/utils/posthog-server.ts`** — Created a singleton PostHog Node.js client for server-side event capture.
- **`src/routes/__root.tsx`** — Wrapped the app shell with `PostHogProvider` from `@posthog/react`, enabling automatic pageview tracking, session replay, and exception capture across all routes.
- **`vite.config.ts`** — Added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) to avoid CORS issues and improve reliability.
- **`src/routes/posts.index.tsx`** — Captures `invoice_created` after a successful form submission, with title, amount, and due date properties. Errors are forwarded to PostHog exception tracking.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_paid` when the user clicks "Mark as Paid" from the invoice detail view, with invoice_id, amount, and title properties.
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_paid` (with a `source: 'deep_view'` property) and `invoice_pdf_downloaded` from the full invoice details view.
- **`src/routes/api/invoices.ts`** — Server-side capture of `invoice_created` in the POST handler.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side capture of `invoice_paid` in the POST handler.
- **`src/routes/api/invoices.$invoiceId.ts`** — Server-side capture of `invoice_updated` (PATCH) and `invoice_deleted` (DELETE) in the respective handlers.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `invoice_created` | User submitted the create invoice form successfully | `src/routes/posts.index.tsx` |
| `invoice_paid` | User marked an invoice as paid from the detail view | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marked an invoice as paid from the full details view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicked the Download PDF button | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server-side: invoice created via REST API | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server-side: invoice paid via REST API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Server-side: invoice updated via REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server-side: invoice deleted via REST API | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've set up an "Analytics basics" dashboard for you to keep an eye on user behavior based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1628607)

Once events start flowing in, you can create insights in PostHog for:
- **Invoice creation trend** — track `invoice_created` over time to measure activity
- **Invoice payment conversion funnel** — funnel from `invoice_created` → `invoice_paid` to measure conversion rate
- **Invoice deletion rate** — track `invoice_deleted` to spot churn signals
- **PDF download engagement** — track `invoice_pdf_downloaded` to measure feature usage

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
