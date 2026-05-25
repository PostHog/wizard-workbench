<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a TanStack Start SaaS application for invoice and team management. The integration covers client-side analytics via `@posthog/react`, server-side tracking via `posthog-node`, a reverse proxy for reliable ingestion, and exception capture at critical user flows.

**Changes made:**

- **`vite.config.ts`** — Added a reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` so PostHog requests route through the dev server, avoiding CORS issues and ad-blocker interference.
- **`src/routes/__root.tsx`** — Wrapped the shell component with `PostHogProvider` using the `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` env var and `/ingest` as the API host.
- **`src/utils/posthog-server.ts`** _(new)_ — Singleton `posthog-node` client used by all server-side handlers.
- **`src/utils/invoices.ts`** — Added server-side `invoice_created` and `invoice_paid` captures inside `createInvoiceFn` and `markInvoicePaid` server functions, with the client's distinct ID and session ID passed as payload for session correlation.
- **`src/routes/api/invoices.$invoiceId.ts`** — Added server-side `invoice_deleted` capture in the DELETE handler, reading `X-PostHog-Distinct-Id` and `X-PostHog-Session-Id` headers.
- **`src/routes/posts.index.tsx`** — Added client-side `invoice_created` capture after successful form submission; passes distinct ID and session ID to the server function for correlation; exceptions are captured on error.
- **`src/routes/posts.$postId.tsx`** — Added `invoice_viewed` (fires once on mount via `useEffect`) and `invoice_paid` (fires after marking paid); exceptions captured on error.
- **`src/routes/posts_.$postId.deep.tsx`** — Added `invoice_paid` on the full-detail page mark-as-paid action; exceptions captured on error.
- **`src/routes/users.$userId.tsx`** — Added `team_member_viewed` (fires once on mount via `useEffect`) when a team member profile is opened.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set.

| Event | Description | File |
|-------|-------------|------|
| `invoice_viewed` | User views an individual invoice detail — top of payment funnel | `src/routes/posts.$postId.tsx` |
| `invoice_created` | User submits Create Invoice form (client) | `src/routes/posts.index.tsx` |
| `invoice_created` | Server confirms new invoice was persisted (server) | `src/utils/invoices.ts` |
| `invoice_paid` | User marks invoice paid from summary view (client) | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks invoice paid from full-detail view (client) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid` | Server confirms invoice status updated to paid (server) | `src/utils/invoices.ts` |
| `invoice_deleted` | Invoice deleted via REST API (server) | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User opens a team member profile page | `src/routes/users.$userId.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in your PostHog project with the following insights:

1. **Invoice creation trend** — Trends chart for `invoice_created` over time, to track growth in new business.
2. **Invoice payment funnel** — Funnel from `invoice_viewed` → `invoice_paid`, to measure conversion rate.
3. **Invoice payment trend** — Trends chart for `invoice_paid` over time, to track revenue activity.
4. **Invoice deletion trend** — Trends chart for `invoice_deleted`, to monitor potential churn signals.
5. **Team engagement** — Trends chart for `team_member_viewed`, to track team collaboration activity.

Create your dashboard here: [PostHog Dashboards](/dashboard)

View your captured events here: [Data Management — Events](/data-management/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
