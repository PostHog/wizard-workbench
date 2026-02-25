<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this TanStack Start CloudFlow project. The integration covers both **client-side** and **server-side** tracking, providing a complete picture of user behavior across the full stack.

## Summary of changes

| File | Change |
|------|--------|
| `package.json` | Added `@posthog/react` and `posthog-node` dependencies |
| `.env` | Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables |
| `vite.config.ts` | Added `/ingest` reverse proxy for PostHog (avoids ad-blockers, reduces CORS issues) |
| `src/utils/posthog-server.ts` | **Created** — singleton PostHog Node.js client for server-side tracking |
| `src/routes/__root.tsx` | Wrapped `RootDocument` body with `PostHogProvider` (auto-captures pageviews, sessions, web vitals, and exceptions) |
| `src/routes/index.tsx` | Added `home_cta_clicked` tracking on "View Invoices" and "Manage Team" CTAs |
| `src/routes/posts.index.tsx` | Added `invoice_created` and `invoice_creation_failed` tracking on form submission |
| `src/routes/posts.$postId.tsx` | Added `invoice_marked_paid` and `invoice_details_expanded` tracking |
| `src/routes/posts_.$postId.deep.tsx` | Added `invoice_marked_paid_from_full_details` and `invoice_pdf_download_clicked` tracking |
| `src/routes/api/invoices.$invoiceId.pay.ts` | Added server-side `invoice_payment_completed` tracking |
| `src/routes/api/invoices.ts` | Added server-side `invoice_created_via_api` tracking |
| `src/routes/api/invoices.$invoiceId.ts` | Added server-side `invoice_deleted` tracking |
| `src/utils/invoices.ts` | Added server-side `invoice_server_created` and `invoice_payment_processed` tracking in server functions |
| `src/components/DefaultCatchBoundary.tsx` | Added `captureException` + `error_caught` event when error boundaries trigger |

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | Fired client-side after a user successfully submits the Create Invoice form | `src/routes/posts.index.tsx` |
| `invoice_creation_failed` | Fired client-side when the invoice creation form submission encounters an error | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | Fired client-side when a user clicks 'Mark as Paid' on the invoice summary view | `src/routes/posts.$postId.tsx` |
| `invoice_details_expanded` | Fired client-side when a user clicks 'View Full Details' — top of payment conversion funnel | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid_from_full_details` | Fired client-side when a user clicks 'Mark as Paid' on the full details page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | Fired client-side when a user clicks 'Download PDF' on the full details page | `src/routes/posts_.$postId.deep.tsx` |
| `home_cta_clicked` | Fired client-side when a user clicks a homepage CTA (View Invoices / Manage Team) | `src/routes/index.tsx` |
| `invoice_payment_completed` | Fired server-side when the pay API route successfully marks an invoice as paid | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_via_api` | Fired server-side when the REST API successfully creates a new invoice | `src/routes/api/invoices.ts` |
| `invoice_deleted` | Fired server-side when the REST API successfully deletes an invoice | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_payment_processed` | Fired server-side in `markInvoicePaid` server function (covers UI-triggered payments) | `src/utils/invoices.ts` |
| `invoice_server_created` | Fired server-side in `createInvoiceFn` server function when a new invoice is created via form | `src/utils/invoices.ts` |
| `error_caught` | Fired client-side when `DefaultCatchBoundary` captures an unhandled error | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **[Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1228088)** — Core analytics tracking invoice lifecycle, payment conversions, CTA engagement, and error monitoring
  - [Invoice Lifecycle Trends](https://us.posthog.com/project/238460/insights/L6wSgKSY) — `invoice_created` vs `invoice_marked_paid` over time
  - [Invoice Payment Conversion Funnel](https://us.posthog.com/project/238460/insights/biJXbnuI) — Conversion from invoice view → payment
  - [CTA Performance by Button](https://us.posthog.com/project/238460/insights/kOdeXEeO) — Homepage CTA click breakdown
  - [Error Tracking Overview](https://us.posthog.com/project/238460/insights/aJI8NBVE) — Application errors over time
  - [Team Member Engagement](https://us.posthog.com/project/238460/insights/0wya2EZ3) — Team member profile view trends

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
