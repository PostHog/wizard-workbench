# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. The integration covers both client-side and server-side tracking with the PostHog JS and Node SDKs.

**Changes made:**

- **`package.json`** — Added `posthog-js`, `@posthog/react`, and `posthog-node` dependencies via pnpm.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`vite.config.ts`** — Added a reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog requests through the dev server and avoid ad blockers.
- **`src/utils/posthog-server.ts`** — New file: singleton `posthog-node` client with graceful no-op when the token is missing.
- **`src/routes/__root.tsx`** — Wrapped the shell body with `PostHogProvider` (guarded by token presence). Enables session replay, autocapture, exception capture, and tracing headers for cross-domain session stitching.
- **`src/routes/index.tsx`** — Captures `dashboard_cta_clicked` when users click the primary CTA buttons on the home dashboard.
- **`src/routes/posts.index.tsx`** — Captures `invoice_created` on successful form submit; `invoice_create_failed` (plus `captureException`) on error.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_marked_paid` when the user marks an invoice as paid.
- **`src/routes/api/invoices.ts`** — Server-side: captures `invoice_created` and `invoice_create_api_error` in the REST API POST handler; reads `X-PostHog-Session-Id` / `X-PostHog-Distinct-Id` headers for session stitching.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side: captures `invoice_paid` in the REST API pay handler.
- **`src/routes/api/invoices.$invoiceId.ts`** — Server-side: captures `invoice_updated` (PATCH) and `invoice_deleted` (DELETE).
- **`src/components/DefaultCatchBoundary.tsx`** — Calls `posthog.captureException(error)` via `useEffect` when the root error boundary catches an uncaught error.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `invoice_created` | User successfully submitted the Create Invoice form and a new invoice was created. | `src/routes/posts.index.tsx` |
| `invoice_create_failed` | Invoice creation failed when the user submitted the Create Invoice form. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicked "Mark as Paid" on an invoice detail page. | `src/routes/posts.$postId.tsx` |
| `dashboard_cta_clicked` | User clicked a primary call-to-action button on the home dashboard. | `src/routes/index.tsx` |
| `invoice_created` | REST API created a new invoice via POST /api/invoices. | `src/routes/api/invoices.ts` |
| `invoice_create_api_error` | REST API rejected an invoice creation request due to missing or invalid fields. | `src/routes/api/invoices.ts` |
| `invoice_paid` | REST API marked an invoice as paid via POST /api/invoices/:id/pay. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | REST API updated invoice fields via PATCH /api/invoices/:id. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | REST API deleted an invoice via DELETE /api/invoices/:id. | `src/routes/api/invoices.$invoiceId.ts` |
| `error_boundary_triggered` | An uncaught error was caught by the root error boundary and sent to PostHog via captureException. | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901961)
- **Invoice creation trend**: [wbTsR6zU](https://us.posthog.com/project/483112/insights/wbTsR6zU)
- **Invoice payment funnel**: [JAt5o5By](https://us.posthog.com/project/483112/insights/JAt5o5By)
- **Dashboard CTA clicks by label**: [hq1536ls](https://us.posthog.com/project/483112/insights/hq1536ls)
- **Invoice actions over time**: [PNMazPOS](https://us.posthog.com/project/483112/insights/PNMazPOS)
- **API errors**: [dFlZykTu](https://us.posthog.com/project/483112/insights/dFlZykTu)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
