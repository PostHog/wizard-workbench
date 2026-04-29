<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. Here is a summary of all changes made:

- **`vite.config.ts`** — Added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) to route analytics requests through the Vite dev server, improving reliability and avoiding CORS issues.
- **`src/routes/__root.tsx`** — Wrapped the app shell with `PostHogProvider` (from `@posthog/react`), initializing PostHog with the project token and host from environment variables. Automatic pageview, session, and web vitals capture is now enabled for all routes.
- **`src/utils/posthog-server.ts`** — Created a singleton server-side PostHog client using `posthog-node` for tracking critical server-side business events.
- **`src/routes/posts.index.tsx`** — Added `invoice_created` event capture on successful invoice form submission, with exception tracking on errors.
- **`src/routes/posts.$postId.tsx`** — Added `invoice_viewed` event (top of payment funnel) on invoice detail load, and `invoice_marked_paid` event when a user marks an invoice as paid.
- **`src/routes/index.tsx`** — Added `home_cta_clicked` event on the "View Invoices" and "Manage Team" CTA buttons.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added server-side `invoice_paid_server` event capture with session correlation headers.
- **`src/routes/api/invoices.ts`** — Added server-side `invoice_created_server` event capture with session correlation headers.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `invoice_created` | User successfully creates a new invoice via the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid from the invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_viewed` | User views an invoice detail page (top of payment conversion funnel) | `src/routes/posts.$postId.tsx` |
| `home_cta_clicked` | User clicks a CTA button on the home page (View Invoices or Manage Team) | `src/routes/index.tsx` |
| `invoice_paid_server` | Server-side: Invoice payment processed via the pay API endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Server-side: Invoice created via the invoices API endpoint | `src/routes/api/invoices.ts` |

## Next steps

We've outlined the key insights and a dashboard to create in PostHog to keep an eye on user behavior based on the events we just instrumented. Create a new dashboard called "Analytics basics" at the link below, then add the following insights:

- **Dashboard**: [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)

Recommended insights to add:

1. **Invoice payment funnel** — Funnel: `invoice_viewed` → `invoice_marked_paid`. Tracks what percentage of viewed invoices get paid.
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new)

2. **Invoice creation trend** — Trend: `invoice_created` over time. Monitors how many invoices are being created daily/weekly.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new)

3. **Home CTA clicks breakdown** — Trend: `home_cta_clicked` broken down by `label` property. Shows which CTA (View Invoices vs Manage Team) drives more engagement.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new)

4. **Server-side invoice payment trend** — Trend: `invoice_paid_server` over time. Tracks server-confirmed payments as a reliable business metric.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new)

5. **Invoice creation volume (server)** — Trend: `invoice_created_server` over time. Server-confirmed invoice creation volume.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
