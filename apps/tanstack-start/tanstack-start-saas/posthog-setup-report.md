<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this TanStack Start SaaS application (CloudFlow). The integration includes client-side analytics via `PostHogProvider`, server-side event capture via `posthog-node`, a reverse proxy for improved reliability and ad-blocker evasion, and automatic error tracking via `captureException`.

**Files created or modified:**

- `src/utils/posthog-server.ts` *(new)* — Singleton PostHog Node.js client for server-side event capture
- `src/routes/__root.tsx` — Added `PostHogProvider` wrapping the shell document for client-side tracking across all routes
- `src/routes/index.tsx` — Added `homepage_cta_clicked` capture on the primary CTA buttons
- `src/routes/posts.$postId.tsx` — Added `invoice_marked_paid` capture when user marks an invoice paid
- `src/routes/posts_.$postId.deep.tsx` — Added `invoice_marked_paid` and `invoice_download_clicked` captures
- `src/routes/api/invoices.ts` — Added server-side `invoice_created` capture with session correlation headers
- `src/routes/api/invoices.$invoiceId.pay.ts` — Added server-side `invoice_paid_server` capture
- `src/routes/api/invoices.$invoiceId.ts` — Added server-side `invoice_deleted` capture
- `src/components/DefaultCatchBoundary.tsx` — Added `posthog.captureException(error)` for automatic error tracking
- `vite.config.ts` — Added `/ingest` reverse proxy to PostHog for improved reliability
- `.env` — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`

| Event Name | Description | File |
|---|---|---|
| `invoice_marked_paid` | User clicks "Mark as Paid" on an invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks "Mark as Paid" on the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_download_clicked` | User clicks "Download PDF" on the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `homepage_cta_clicked` | User clicks "View Invoices" or "Manage Team" CTA on the homepage | `src/routes/index.tsx` |
| `invoice_created` | Server-side: a new invoice is created via the API | `src/routes/api/invoices.ts` |
| `invoice_paid_server` | Server-side: an invoice is marked as paid via the API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted` | Server-side: an invoice is deleted via the API | `src/routes/api/invoices.$invoiceId.ts` |
| `$exception` | Automatic error tracking when an error boundary is triggered | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

To create an "Analytics basics" dashboard in PostHog for these events, navigate to:

- [PostHog Project 2 Dashboards](https://us.posthog.com/project/2/dashboards)

Suggested insights to add to the dashboard:

1. **Invoice Payment Funnel** — Funnel from `$pageview` (on `/posts`) → `invoice_marked_paid`. Shows conversion from viewing invoices to completing payment.
2. **Invoice Payments Over Time** — Trend of `invoice_marked_paid` events. Key business metric for payment volume.
3. **Homepage CTA Conversion** — Breakdown of `homepage_cta_clicked` by `cta` property (`view_invoices` vs `manage_team`). Shows which CTA drives more engagement.
4. **Server-side Invoice Operations** — Trend of `invoice_created`, `invoice_paid_server`, and `invoice_deleted` events together. Tracks business activity.
5. **Error Rate** — Trend of `$exception` events. Critical for monitoring application health and churn risk.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
