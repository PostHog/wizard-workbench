<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this TanStack Start (CloudFlow) application. PostHog is now initialized client-side via `PostHogProvider` in the root shell component (`__root.tsx`), with a reverse proxy configured in Vite for reliable event ingestion. A server-side singleton client (`src/utils/posthog-server.ts`) powers tracking in all API route handlers. Session replay, error tracking, and automatic pageview capture are all enabled via the `defaults: '2025-05-24'` and `capture_exceptions: true` options.

| Event | Description | File |
|-------|-------------|------|
| `invoice_payment_initiated` | User clicks "Mark as Paid" on the invoice detail panel | `src/routes/posts.$postId.tsx` |
| `invoice_payment_initiated` | User clicks "Mark as Paid" from the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks "Download PDF" on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | User successfully submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_paid` | Invoice payment confirmed server-side via the REST pay endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Invoice created server-side via the REST invoices POST endpoint | `src/routes/api/invoices.ts` |
| `invoice_deleted` | Invoice deleted server-side via the REST delete endpoint | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_updated` | Invoice updated server-side via the REST PATCH endpoint | `src/routes/api/invoices.$invoiceId.ts` |
| `app_error` | Application error captured in the root error boundary (via `captureException`) | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

Create a **"Analytics basics (wizard)"** dashboard in PostHog with these five insights:

1. **Invoice payment funnel** — Funnel insight: `invoice_payment_initiated` → `invoice_paid` to track conversion from payment intent to confirmed payment.
2. **Invoice creation rate** — Trends insight: `invoice_created` event count over time to track business growth.
3. **Invoice operations breakdown** — Trends insight: `invoice_created`, `invoice_paid`, `invoice_updated`, `invoice_deleted` side-by-side to visualize invoice lifecycle activity.
4. **PDF download rate** — Trends insight: `invoice_pdf_downloaded` over time to track document engagement.
5. **Error rate** — Trends insight: `$exception` (PostHog's built-in) over time to monitor application health.

You can create this dashboard at [PostHog Dashboards](https://us.posthog.com/project/2/dashboards).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
