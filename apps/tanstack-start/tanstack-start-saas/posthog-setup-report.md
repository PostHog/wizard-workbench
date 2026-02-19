<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The following changes were made:

- **Installed packages**: `posthog-js` (client-side) and `posthog-node` (server-side) via pnpm.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` written to `.env` and covered by `.gitignore`.
- **Reverse proxy**: `vite.config.ts` updated with a `/ingest` proxy to `https://us.i.posthog.com`, improving reliability and avoiding ad-blocker issues.
- **PostHogProvider**: Added to `src/routes/__root.tsx` shell component — wraps the entire app with client-side analytics, session replay, and automatic exception capture (`capture_exceptions: true`).
- **Server-side client**: New `src/utils/posthog-server.ts` singleton using `posthog-node` for all server-side event capture, with `flushAt: 1` to ensure events flush immediately per request.
- **Client-side events**: Captured in invoice and team member routes using `usePostHog()` hook.
- **Server-side events**: Captured in API route handlers using the singleton server client, with `$session_id` and distinct ID correlation headers supported.
- **Error tracking**: `DefaultCatchBoundary` now calls `posthog.captureException()` to automatically report all unhandled errors.
- **TypeScript**: All changes pass `tsc --noEmit` with zero errors.

| Event | Description | File |
|---|---|---|
| `invoice_created` | Fired when a user successfully creates a new invoice via the form | `src/routes/posts.index.tsx` |
| `invoice_viewed` | Fired when a user views an invoice detail page (top of payment funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired when a user clicks "Mark as Paid" and the action succeeds | `src/routes/posts.$postId.tsx` |
| `invoice_paid_server` | Server-side: fired when `POST /api/invoices/:id/pay` succeeds — critical payment event | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Server-side: fired when `POST /api/invoices` succeeds | `src/routes/api/invoices.ts` |
| `invoice_deleted_server` | Server-side: fired when `DELETE /api/invoices/:id` succeeds | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | Fired when a user views a team member profile page | `src/routes/users.$userId.tsx` |
| `$exception` (via `captureException`) | Fired automatically for every error that reaches the error boundary | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

Once events are flowing, you can build the following insights in PostHog:

- **Invoice payment funnel**: `invoice_viewed` → `invoice_marked_paid` to measure conversion rate
- **Invoice activity trends**: `invoice_created` and `invoice_marked_paid` over time
- **Server-side payment confirmations**: `invoice_paid_server` as the ground-truth payment metric
- **Team engagement**: `team_member_viewed` over time
- **Error rate**: `$exception` over time to monitor app stability

Navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) to create a new **"Analytics basics"** dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
