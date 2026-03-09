<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start SaaS application. Here is a summary of all changes made:

**Client-side setup:** `PostHogProvider` from `@posthog/react` was added to `src/routes/__root.tsx` in the `RootDocument` shell component, wrapping all child routes. This enables automatic pageview tracking, session replay, and error capture across the entire application. A Vite dev proxy was configured at `/ingest` to route PostHog requests through the dev server, improving reliability and avoiding CORS issues.

**Server-side setup:** A singleton PostHog Node.js client (`src/utils/posthog-server.ts`) was created using `posthog-node`. This client is used across API routes to capture server-side events with session correlation via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.

**Event tracking:** 7 distinct events were instrumented across 6 files, covering the full invoice lifecycle (create → view → pay → delete) plus error tracking with `posthog.captureException()`.

**Packages installed:** `posthog-js`, `@posthog/react`, `posthog-node`

**Environment variables:** `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` set in `.env`.

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form successfully | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks the Mark as Paid button on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks the Mark as Paid button on the invoice deep detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks the Download PDF button on the invoice deep detail view | `src/routes/posts_.$postId.deep.tsx` |
| `server_invoice_created` | Server-side: invoice created via API POST /api/invoices | `src/routes/api/invoices.ts` |
| `server_invoice_paid` | Server-side: invoice marked as paid via API POST /api/invoices/$invoiceId/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `server_invoice_deleted` | Server-side: invoice deleted via API DELETE /api/invoices/$invoiceId | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We recommend building the following insights in your PostHog dashboard to keep an eye on user behavior based on the events we just instrumented. Navigate to [PostHog Insights](https://us.posthog.com/project/2/insights) to create them:

1. **Invoice Creation Trend** — Trends chart on `invoice_created`, broken down by day. Tracks how many new invoices are being created over time.

2. **Invoice Payment Conversion Funnel** — Funnel from `invoice_created` → `invoice_marked_paid`. Shows what percentage of created invoices get paid, and where drop-off occurs.

3. **Invoice Lifecycle (Server vs Client)** — Trends chart comparing `server_invoice_created` and `server_invoice_paid` over time. Validates that server-side and client-side events are correlated.

4. **PDF Download Engagement** — Trends chart on `invoice_pdf_downloaded`. Shows how often users engage with the invoice detail view to download PDFs.

5. **Invoice Deletion Rate** — Trends chart on `server_invoice_deleted`. Tracks churn signals — high deletion rates may indicate user dissatisfaction.

To create a dashboard, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and click **New dashboard** → **Add insights** using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
