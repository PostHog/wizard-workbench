<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The following changes were made:

- **`src/routes/__root.tsx`** — Added `PostHogProvider` from `@posthog/react` wrapping the app shell. Configured with a reverse proxy path (`/ingest`), exception autocapture, and debug mode in development.
- **`vite.config.ts`** — Added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) to route through the Vite dev server and avoid ad blockers.
- **`src/utils/posthog-server.ts`** — Created a singleton `posthog-node` client (`getPostHogClient()`) for server-side event capture across API routes and server functions.
- **`src/routes/posts.index.tsx`** — Captures `invoice_created` client-side after the invoice form submits successfully.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_marked_paid` client-side when the user clicks "Mark as Paid" on the invoice summary view.
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_marked_paid` client-side when the user clicks "Mark as Paid" on the full invoice detail view (with a `view: 'full_detail'` property).
- **`src/utils/invoices.ts`** — Added server-side captures for `invoice_created` and `invoice_paid` inside the `createInvoiceFn` and `markInvoicePaid` server functions.
- **`src/routes/api/invoices.ts`** — Added server-side `invoice_created` capture in the REST API POST handler, reading `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers for session correlation.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added server-side `invoice_paid` capture in the REST API payment handler.
- **`src/routes/api/invoices.$invoiceId.ts`** — Added server-side `invoice_updated` and `invoice_deleted` captures in the REST API PATCH and DELETE handlers.

| Event name | Description | File |
|---|---|---|
| `invoice_created` | User successfully submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on the invoice summary view | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server confirms a new invoice was created via server function | `src/utils/invoices.ts` |
| `invoice_paid` | Server confirms an invoice was marked paid via server function | `src/utils/invoices.ts` |
| `invoice_created` | Invoice created via REST API POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice paid via REST API POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice fields updated via REST API PATCH /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice removed via REST API DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829406)
- [Invoice creation trend (wizard)](https://us.posthog.com/project/483112/insights/0031sUQZ) — Daily line chart of new invoices created over 30 days
- [Invoice payment funnel (wizard)](https://us.posthog.com/project/483112/insights/iUhyPzuF) — Ordered funnel from `invoice_created` → `invoice_marked_paid` with a 14-day conversion window
- [Invoices paid (wizard)](https://us.posthog.com/project/483112/insights/qRV54Ai8) — Bold number showing total paid invoices over 30 days
- [Invoice lifecycle (wizard)](https://us.posthog.com/project/483112/insights/lSuaLJN0) — Weekly stacked bar comparing invoices created vs paid over 90 days
- [Invoice deletions (wizard)](https://us.posthog.com/project/483112/insights/OrqPVwOi) — Daily bar chart of invoice deletions, a signal for dissatisfaction or mistakes

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog error tracking.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
