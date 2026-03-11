<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. Changes include:

- **Installed packages**: `posthog-js`, `posthog-node`, and `@posthog/react` via pnpm.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` added to `.env` (already covered by `.gitignore`).
- **Client-side provider**: `PostHogProvider` added to `src/routes/__root.tsx` (`RootDocument` shell component), wrapping the entire app with session replay, exception capture, and automatic pageview tracking enabled.
- **Reverse proxy**: `/ingest` proxy added to `vite.config.ts` so PostHog requests route through the dev server, avoiding CORS issues.
- **Server-side client**: `src/utils/posthog-server.ts` created as a singleton `posthog-node` client for server-side event capture.
- **Client-side events**: `invoice_created` and `invoice_marked_paid` captured in the invoice UI components.
- **Server-side events**: `invoice_created_server`, `invoice_paid_server`, and `invoice_deleted_server` captured in the API route handlers, with `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` header support for session correlation.

| Event | Description | File |
|---|---|---|
| `invoice_created` | Fired when a user successfully creates a new invoice via the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | Fired when a user marks an invoice as paid from the invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired when a user marks an invoice as paid from the full invoice detail deep view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created_server` | Server-side event fired when an invoice is created via the REST API POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_paid_server` | Server-side event fired when an invoice is paid via the REST API POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted_server` | Server-side event fired when an invoice is deleted via the REST API DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

The PostHog API key used did not have `dashboard:write` scope, so the "Analytics basics" dashboard could not be created automatically. You can create it manually in PostHog with these suggested insights based on the instrumented events:

1. **Invoice creation trend** — Trend chart of `invoice_created` over time to track how many invoices are being created.
2. **Invoice payment funnel** — Funnel: `invoice_created` → `invoice_marked_paid` to measure conversion from created to paid.
3. **Invoice payment rate** — Formula insight: `invoice_marked_paid` / `invoice_created` to track the percentage of invoices that get paid.
4. **Invoice deletions** — Trend chart of `invoice_deleted_server` to monitor churn/cancellation signals.
5. **Server vs client payment events** — Compare `invoice_marked_paid` (client) with `invoice_paid_server` (server) volume to verify tracking completeness.

To create the dashboard: go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) → New dashboard → "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
