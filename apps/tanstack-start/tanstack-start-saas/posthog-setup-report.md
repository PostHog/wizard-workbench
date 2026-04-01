<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Start application. Here is a summary of the changes made:

- **`posthog-js`**, **`posthog-node`**, and **`@posthog/react`** were installed as dependencies.
- **`vite.config.ts`** was updated to add a reverse proxy for PostHog ingestion (`/ingest` → `https://us.i.posthog.com`), improving reliability and avoiding CORS issues.
- **`.env`** was created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`src/utils/posthog-server.ts`** was created as a singleton server-side PostHog client using `posthog-node`.
- **`src/routes/__root.tsx`** was updated to wrap the app shell in `PostHogProvider`, enabling automatic pageview tracking, session replay, and exception capture for all routes.
- Client-side event tracking was added to invoice detail pages.
- Server-side event tracking was added to invoice API routes, including session correlation via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `invoice_viewed` | Fired when a user opens the detail view for an invoice (top of conversion funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired on the client when the user clicks "Mark as Paid" on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired on the client when the user clicks "Mark as Paid" on the deep invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | Fired when the user clicks the "Download PDF" button on the invoice deep detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid` | Server-side: fired when an invoice payment is successfully processed via the pay API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Server-side: fired when a new invoice is successfully created via the invoices API | `src/routes/api/invoices.ts` |

## Next steps

We've set up the integration — here are direct links to build insights and a dashboard in PostHog for your project:

- [Open PostHog dashboards](https://us.posthog.com/project/238460/dashboards) — create an "Analytics basics" dashboard here
- [Invoice payment funnel insight](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS) — add `invoice_viewed` → `invoice_marked_paid` → `invoice_paid` as funnel steps
- [Invoice creation trend](https://us.posthog.com/project/238460/insights/new?insight=TRENDS) — plot `invoice_created` over time to track new business
- [Invoice paid trend](https://us.posthog.com/project/238460/insights/new?insight=TRENDS) — plot `invoice_paid` over time to track revenue collection
- [PDF downloads trend](https://us.posthog.com/project/238460/insights/new?insight=TRENDS) — plot `invoice_pdf_downloaded` to measure document export activity

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
