# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration adds client-side event tracking using `PostHogProvider` from `posthog-js/react` in the root route, a singleton server-side PostHog client using `posthog-node` for API route tracking, a reverse proxy configuration in Vite, and environment variable configuration.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `invoice_created` | User successfully submits the create invoice form with all required fields. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks the Mark as Paid button on an invoice detail page. | `src/routes/posts.$postId.tsx` |
| `invoice_full_details_opened` | User clicks the View Full Details link to navigate to the deep invoice view. | `src/routes/posts.$postId.tsx` |
| `home_view_invoices_clicked` | User clicks the View Invoices CTA button on the home page. | `src/routes/index.tsx` |
| `home_manage_team_clicked` | User clicks the Manage Team CTA button on the home page. | `src/routes/index.tsx` |
| `home_pending_invoice_clicked` | User clicks the View Invoice link in the pending items widget on the home page. | `src/routes/index.tsx` |
| `invoice_created` | Invoice created via REST API POST handler on the server side. | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice marked as paid via REST API POST handler on the server side. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice fields updated via REST API PATCH handler on the server side. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice deleted via REST API DELETE handler on the server side. | `src/routes/api/invoices.$invoiceId.ts` |

## Files changed

- **`src/routes/__root.tsx`** — Added `PostHogProvider` from `posthog-js/react` wrapping the app shell, configured with `/ingest` reverse proxy, exception capture, debug mode, and session tracing headers.
- **`src/utils/posthog-server.ts`** _(new)_ — Singleton `getPostHogClient()` function using `posthog-node` for server-side tracking, with `flushAt: 1` / `flushInterval: 0` to flush before each short-lived handler returns.
- **`vite.config.ts`** — Added `/ingest`, `/ingest/static`, and `/ingest/array` reverse proxy rules routing PostHog traffic through the dev server.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`src/routes/index.tsx`** — Added `usePostHog` and click event captures for the three home page CTAs.
- **`src/routes/posts.index.tsx`** — Added `invoice_created` capture (with invoice ID and amount) on successful form submission; added `captureException` in the error path.
- **`src/routes/posts.$postId.tsx`** — Added `invoice_marked_paid` capture in `handleMarkAsPaid`; added `invoice_full_details_opened` capture on the "View Full Details" Link click; added `captureException` in the error path.
- **`src/routes/api/invoices.ts`** — Added server-side `invoice_created` capture in the POST handler using `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added server-side `invoice_paid` capture in the POST handler.
- **`src/routes/api/invoices.$invoiceId.ts`** — Added server-side `invoice_updated` (PATCH) and `invoice_deleted` (DELETE) captures.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902733)
- **Insight**: [Invoices created over time (wizard)](https://us.posthog.com/project/483112/insights/vL5UvOjD)
- **Insight**: [Invoices paid over time (wizard)](https://us.posthog.com/project/483112/insights/cqeM6VcB)
- **Insight**: [Invoice creation to payment funnel (wizard)](https://us.posthog.com/project/483112/insights/5LuZ1OOR)
- **Insight**: [Home page to invoice action funnel (wizard)](https://us.posthog.com/project/483112/insights/r7JpmLLu)
- **Insight**: [Invoice lifecycle events (wizard)](https://us.posthog.com/project/483112/insights/2UqPNyop)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
