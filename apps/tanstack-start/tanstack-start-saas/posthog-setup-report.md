<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The following changes were made:

- **`posthog-js`**, **`posthog-node`**, and **`@posthog/react`** packages installed
- **`PostHogProvider`** added to `src/routes/__root.tsx` (wraps the entire app in the shell component) with session replay, exception capture, and reverse proxy support
- **Reverse proxy** configured in `vite.config.ts` — PostHog requests route through `/ingest` to avoid ad blockers
- **`src/utils/posthog-server.ts`** created — singleton `posthog-node` client for server-side event capture
- **Environment variables** set in `.env`: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`
- **Client-side events** added to invoice and team member routes
- **Server-side events** added to API route handlers for critical business operations

| Event | Description | File |
|-------|-------------|------|
| `invoice_viewed` | User views details of a specific invoice — top of the payment conversion funnel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User clicks the "Mark as Paid" button on an invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoices_list_viewed` | User views the invoices list page — entry point to the invoice management funnel | `src/routes/posts.tsx` |
| `invoice_created` | A new invoice is created via the POST /api/invoices server route | `src/routes/api/invoices.ts` |
| `invoice_payment_processed` | An invoice payment is processed via the POST /api/invoices/$invoiceId/pay server route | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted` | An invoice is deleted via the DELETE /api/invoices/$invoiceId server route | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User views a team member's profile page | `src/routes/users.$userId.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights based on the events above:

1. **Invoice payment conversion funnel** — funnel from `invoices_list_viewed` → `invoice_viewed` → `invoice_paid`
2. **Invoice creation over time** — trend chart of `invoice_created` (server-side) to track business growth
3. **Payment processing volume** — trend of `invoice_payment_processed` with `invoice_amount` property breakdown
4. **Invoice deletion rate** — `invoice_deleted` count over time (churn/cancellation signal)
5. **Team activity** — `team_member_viewed` unique user count over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
