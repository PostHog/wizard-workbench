<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this TanStack Start SaaS project (CloudFlow — a business management platform for invoicing and team management).

## What was set up

**Client-side (`@posthog/react`):** `PostHogProvider` was added to the root shell component (`__root.tsx`), wrapping the entire application. This enables automatic pageview capture, session replay, and web vitals tracking. Custom events are captured using the `usePostHog()` hook in individual route components.

**Server-side (`posthog-node`):** A singleton PostHog Node client was created at `src/utils/posthog-server.ts` and imported into all API route handlers to capture critical server-side business events (invoice creation, payment, update, deletion).

**Reverse proxy:** Vite's dev server proxy was configured to route PostHog ingestion traffic through `/ingest` to avoid CORS issues and improve reliability in development.

**Error tracking:** `posthog.captureException()` was added around critical async operations (invoice create, invoice pay) so exceptions are automatically reported to PostHog.

**Environment variables:** `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are stored in `.env` and referenced via `import.meta.env` in client code and `process.env` / `import.meta.env` in server code.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | User submits the create invoice form successfully (client-side) | `src/routes/posts.index.tsx` |
| `invoice_viewed` | User opens an invoice detail page — top of payment conversion funnel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User clicks Mark as Paid on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User clicks Mark as Paid on the full detail page | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User navigates to a team member profile | `src/routes/users.$userId.tsx` |
| `invoice_created` | Server-side confirmation when POST /api/invoices succeeds | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server-side confirmation when POST /api/invoices/$id/pay succeeds | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Server-side event when PATCH /api/invoices/$id succeeds | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server-side event when DELETE /api/invoices/$id succeeds | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've set up an "Analytics basics" dashboard to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1632735)

Recommended insights to add to this dashboard:

1. **Invoice creation trend** — `invoice_created` over time (trends)
2. **Invoice payment funnel** — `invoice_viewed` → `invoice_paid` conversion rate (funnel)
3. **Invoice paid volume** — total `invoice_paid` events with `invoice_amount` sum (trends)
4. **Team engagement** — `team_member_viewed` over time by member (trends)
5. **Invoice lifecycle** — `invoice_created` vs `invoice_deleted` over time (trends)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
