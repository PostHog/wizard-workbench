<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. Here is a summary of all changes made:

## What was set up

- **Client-side SDK**: `@posthog/react` installed and `PostHogProvider` added to `src/routes/__root.tsx` (the root shell component), enabling automatic pageview tracking, session replay, and error capture across all routes.
- **Server-side SDK**: `posthog-node` installed and a singleton `getPostHogClient()` utility created at `src/utils/posthog-server.ts` for server-side event capture.
- **Reverse proxy**: Vite dev server configured in `vite.config.ts` to proxy PostHog ingestion through `/ingest`, improving reliability and ad-blocker resilience.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set in `.env`.
- **Event tracking**: 13 events instrumented across 7 files — client-side user interactions and server-side business operations.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `home_view_invoices_clicked` | User clicked "View Invoices" CTA on the home page | `src/routes/index.tsx` |
| `home_manage_team_clicked` | User clicked "Manage Team" CTA on the home page | `src/routes/index.tsx` |
| `home_view_invoice_clicked` | User clicked "View Invoice" in the pending items banner | `src/routes/index.tsx` |
| `invoice_mark_as_paid_clicked` | User clicked "Mark as Paid" on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_full_details_clicked` | User clicked "View Full Details" to open the deep invoice view | `src/routes/posts.$postId.tsx` |
| `invoice_mark_as_paid_clicked` | User clicked "Mark as Paid" on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_download_pdf_clicked` | User clicked "Download PDF" on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid` | Server-side: invoice successfully marked as paid (via server function) | `src/utils/invoices.ts` |
| `invoice_paid` | Server-side: invoice successfully marked as paid (via REST API) | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Server-side: a new invoice was created via the REST API | `src/routes/api/invoices.ts` |
| `invoice_updated` | Server-side: an invoice was updated (PATCH) via the REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server-side: an invoice was deleted via the REST API | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We recommend building the following insights in PostHog to monitor your key business metrics:

### Suggested dashboard: "Analytics basics"

Create a new dashboard in PostHog and add these insights:

1. **Invoice payment funnel** — Funnel from `home_view_invoices_clicked` → `invoice_mark_as_paid_clicked` → `invoice_paid`. Shows where users drop off in the payment flow.

2. **Invoice payments over time** — Trend chart of `invoice_paid` events. Tracks revenue activity week over week.

3. **Home page CTA engagement** — Bar chart comparing `home_view_invoices_clicked`, `home_manage_team_clicked`, and `home_view_invoice_clicked`. Reveals which CTAs drive the most engagement.

4. **Invoice lifecycle actions** — Stacked area of `invoice_created`, `invoice_updated`, `invoice_deleted`. Shows overall invoice management activity.

5. **Full details conversion** — Funnel from `invoice_full_details_clicked` → `invoice_download_pdf_clicked` or `invoice_mark_as_paid_clicked`. Measures how often users who open full details complete an action.

Visit your PostHog project to create these:
- [New Insight](https://us.posthog.com/project/2/insights/new)
- [New Dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
