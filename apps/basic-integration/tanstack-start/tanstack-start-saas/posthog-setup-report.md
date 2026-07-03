# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a TanStack Start SaaS application for business invoice management and team collaboration.

**Changes made:**

- Installed `posthog-js` and `posthog-node` packages
- Created `src/utils/posthog-server.ts` — singleton server-side PostHog client
- Updated `src/routes/__root.tsx` — added `PostHogProvider` to the root shell component with reverse proxy config, exception capture enabled
- Updated `vite.config.ts` — added reverse proxy rules routing `/ingest/*` to PostHog ingestion endpoints
- Updated `src/routes/posts.index.tsx` — captures `invoice_created` on form success, `invoice_create_failed` on error
- Updated `src/routes/posts.$postId.tsx` — captures `invoice_viewed` on mount and `invoice_marked_paid` on button click
- Updated `src/routes/posts_.$postId.deep.tsx` — captures `invoice_marked_paid` and `invoice_pdf_downloaded`
- Updated `src/components/DefaultCatchBoundary.tsx` — calls `posthog.captureException()` on all caught errors
- Updated `src/routes/api/invoices.$invoiceId.pay.ts` — server-side `invoice_paid` event (critical payment confirmation)
- Updated `src/routes/api/invoices.ts` — server-side `invoice_created` event via REST API
- Updated `src/routes/api/invoices.$invoiceId.ts` — server-side `invoice_updated` and `invoice_deleted` events
- Added `.env` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`

## Events

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | Fired client-side when a user successfully submits the create invoice form. | `src/routes/posts.index.tsx` |
| `invoice_create_failed` | Fired client-side when the create invoice form submission encounters an error. | `src/routes/posts.index.tsx` |
| `invoice_viewed` | Fired when a user opens an invoice detail page — the start of the payment conversion funnel. | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired client-side when a user clicks 'Mark as Paid' on the invoice detail panel. | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired client-side when a user clicks 'Mark as Paid' on the full-page invoice detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | Fired client-side when a user clicks the Download PDF button on the full invoice detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid` | Server-side: fired when invoice payment is confirmed by the pay API endpoint. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Server-side: fired when a new invoice is successfully created via the REST API. | `src/routes/api/invoices.ts` |
| `invoice_deleted` | Server-side: fired when an invoice is deleted via the REST API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_updated` | Server-side: fired when an invoice is updated via the REST API. | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793587)
- [Invoice Volume (wizard)](https://us.posthog.com/project/483112/insights/gI1r8RPq) — Total invoices created over time
- [Invoice Payments (wizard)](https://us.posthog.com/project/483112/insights/7A8p2MbT) — Invoice paid events from server and client
- [Invoice View-to-Pay Funnel (wizard)](https://us.posthog.com/project/483112/insights/Ued1nWtY) — Conversion from invoice viewed to payment
- [Invoice Errors (wizard)](https://us.posthog.com/project/483112/insights/rvoEs1ai) — Invoice creation failures
- [Invoice PDF Downloads (wizard)](https://us.posthog.com/project/483112/insights/7gYt8s0A) — PDF download rate vs views

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/CD bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
