# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration covers client-side analytics via `@posthog/react`, server-side event capture via `posthog-node`, automatic error tracking, and a Vite reverse proxy so all PostHog traffic routes through `/ingest`.

**Files created or modified:**

- `src/routes/__root.tsx` — Added `PostHogProvider` wrapping the app shell in `RootDocument`, configured with the reverse proxy host and automatic exception capture.
- `vite.config.ts` — Added proxy rules for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog traffic through the dev server.
- `src/utils/posthog-server.ts` _(new)_ — Singleton `posthog-node` client (`getPostHogClient()`) used by all server-side API routes.
- `src/routes/posts.index.tsx` — Captures `invoice_created` after a successful form submission.
- `src/routes/posts.$postId.tsx` — Captures `invoice_paid` after marking an invoice as paid from the detail panel.
- `src/routes/posts_.$postId.deep.tsx` — Captures `invoice_paid` after marking paid from the full-details page; captures `invoice_download_clicked` when the Download PDF button is clicked.
- `src/routes/api/invoices.ts` — Server-side capture of `invoice_created` on `POST /api/invoices`.
- `src/routes/api/invoices.$invoiceId.pay.ts` — Server-side capture of `invoice_payment_processed` on `POST /api/invoices/:id/pay`.
- `src/routes/api/invoices.$invoiceId.ts` — Server-side capture of `invoice_updated` (PATCH) and `invoice_deleted` (DELETE).
- `src/components/DefaultCatchBoundary.tsx` — Calls `posthog.captureException(error)` whenever the global error boundary renders an error.
- `.env` — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File(s) |
|-------|-------------|---------|
| `invoice_created` | User submits the create-invoice form | `src/routes/posts.index.tsx` |
| `invoice_created` | Invoice created via REST API (server-side) | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice marked as paid from detail panel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | Invoice marked as paid from full-details page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_download_clicked` | Download PDF button clicked | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_payment_processed` | Payment processed via REST API (server-side) | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice updated via REST API (server-side) | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice deleted via REST API (server-side) | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

The PostHog API key used by the wizard does not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created programmatically. Create it manually using the links below — the suggested insights map directly to the events instrumented above:

- **[Create a new dashboard](https://us.posthog.com/project/2/dashboard)** — name it "Analytics basics (wizard)"
- **[Create a new insight](https://us.posthog.com/project/2/insights/new)** — suggested insights:
  1. **Invoice creation trend** — Trends chart for `invoice_created` over time
  2. **Invoice payment trend** — Trends chart for `invoice_paid` over time
  3. **Invoice payment funnel** — Funnel from `invoice_created` → `invoice_paid`
  4. **Invoice download engagement** — Trends chart for `invoice_download_clicked`
  5. **Invoice deletion rate** — Trends chart for `invoice_deleted` (churn signal)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
