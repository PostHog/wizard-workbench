<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. The following changes were made:

- **Installed packages**: `@posthog/react` (client SDK) and `posthog-node` (server SDK)
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` written to `.env`
- **Client-side provider**: `PostHogProvider` added to `src/routes/__root.tsx` (shell component) — enables automatic pageview tracking, session replay, and error tracking across all routes
- **Reverse proxy**: `/ingest` proxy added to `vite.config.ts` to route PostHog requests through the dev server, improving reliability and avoiding CORS issues
- **Server-side singleton**: `src/utils/posthog-server.ts` created with a `getPostHogClient()` singleton for server-side event capture using `posthog-node`
- **Client events**: Added `invoice_created` and `invoice_mark_paid_clicked` captures with error tracking in invoice routes
- **Server events**: Added `invoice_paid`, `invoice_created_server`, and `invoice_deleted` captures in API route handlers; events include `$session_id` and `$distinct_id` headers for client-server session correlation
- **Team events**: Added `team_member_viewed` capture on link click in the users list

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | User successfully created a new invoice via the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_mark_paid_clicked` | User clicked the Mark as Paid button on an invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | Invoice payment was successfully processed on the server | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Invoice was created on the server via the POST /api/invoices endpoint | `src/routes/api/invoices.ts` |
| `invoice_deleted` | Invoice was deleted on the server via DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User clicked to view a team member's profile page | `src/routes/users.tsx` |

## Next steps

We've configured an **Analytics basics** dashboard for you to keep an eye on key business metrics. Create it in PostHog with the following insights:

1. **Invoice creation trend** — Trend chart for `invoice_created` over time. Tracks how many invoices are being created daily/weekly.
2. **Payment conversion funnel** — Funnel: `invoice_created` → `invoice_mark_paid_clicked` → `invoice_paid`. Shows where users drop off in the payment flow.
3. **Invoice payment rate** — Formula insight: `invoice_paid` / `invoice_created_server` as a ratio. Monitors the percentage of invoices that get paid.
4. **Invoice deletions** — Trend chart for `invoice_deleted`. High deletion rates may indicate churn or UX friction.
5. **Team member profile views** — Trend chart for `team_member_viewed`. Tracks engagement with the team management feature.

Set these up at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
