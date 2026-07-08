<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The following changes were made:

- **`posthog-js`** and **`posthog-node`** were installed as dependencies.
- **`src/utils/posthog-server.ts`** — new singleton server-side PostHog client using `posthog-node`.
- **`vite.config.ts`** — added reverse proxy routes (`/ingest`, `/ingest/static`, `/ingest/array`) to tunnel PostHog requests through the Vite dev server, avoiding ad-blockers.
- **`src/routes/__root.tsx`** — wrapped the shell document body in `PostHogProvider` with `capture_exceptions: true` and the reverse-proxy `api_host`.
- **`src/routes/posts.index.tsx`** — captures `invoice_created` on successful form submission; captures exceptions on failure.
- **`src/routes/posts.$postId.tsx`** — captures `invoice_marked_paid` when the Mark as Paid button succeeds; captures exceptions on error.
- **`src/routes/posts_.$postId.deep.tsx`** — captures `invoice_marked_paid` on the full detail page; captures `invoice_pdf_downloaded` on the Download PDF button click; captures exceptions on error.
- **`src/routes/api/invoices.ts`** — captures server-side `invoice_created` on REST API POST, correlating via `X-PostHog-Session-Id` / `X-PostHog-Distinct-Id` headers.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — captures server-side `invoice_paid` on REST API pay endpoint.
- **`src/routes/api/invoices.$invoiceId.ts`** — captures server-side `invoice_updated` on PATCH and `invoice_deleted` on DELETE.
- **`src/components/DefaultCatchBoundary.tsx`** — calls `posthog.captureException(error)` in the global error boundary.
- **`.env`** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` written (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `invoice_created` | User successfully submits the new invoice form on the client | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on the invoice detail panel | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks the Download PDF button on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Invoice created via the REST API POST endpoint | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice marked as paid via the REST API pay endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice fields updated via the REST API PATCH endpoint | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice removed via the REST API DELETE endpoint | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818317)
- [Invoice Creations Over Time](https://us.posthog.com/project/483112/insights/8WcP6yf6)
- [Invoices Marked Paid Over Time](https://us.posthog.com/project/483112/insights/WFmBqgfj)
- [Invoice Creation to Payment Funnel](https://us.posthog.com/project/483112/insights/hDoaorW7)
- [All Invoice Actions](https://us.posthog.com/project/483112/insights/nxEMMnhE)
- [Invoice PDF Downloads](https://us.posthog.com/project/483112/insights/h0Avwj1p)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`).
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
