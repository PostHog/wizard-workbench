<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for CloudFlow, a TanStack Start SaaS application. Both client-side and server-side analytics are wired up, with error tracking and a reverse proxy configured.

**Changes made:**

- **`vite.config.ts`** — Added a reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog traffic through the Vite dev server, avoiding ad blockers.
- **`src/routes/__root.tsx`** — Wrapped the shell body with `PostHogProvider` (using env vars for token and host) with `capture_exceptions: true` enabled.
- **`src/utils/posthog-server.ts`** *(new)* — Singleton `getPostHogClient()` for server-side event capture using `posthog-node` with immediate flush settings.
- **`src/components/DefaultCatchBoundary.tsx`** — Added `posthog.captureException(error)` so all React boundary errors are automatically sent to PostHog Error Tracking.
- **`src/routes/index.tsx`** — Tracks `dashboard_cta_clicked` with a `destination` property when users click the hero CTAs.
- **`src/routes/posts.$postId.tsx`** — Tracks `invoice_paid` (with invoice ID, title, amount) and `invoice_details_viewed` (when navigating to the deep invoice view).
- **`src/routes/posts_.$postId.deep.tsx`** — Tracks `invoice_paid` (with `source: 'deep_view'`) and `invoice_pdf_downloaded`.
- **`src/routes/users.$userId.tsx`** — Tracks `team_member_viewed` with user ID and role on component mount.
- **`src/routes/api/invoices.ts`** — Server-side: tracks `invoice_created` after successful POST, reading `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers for session correlation.
- **`src/routes/api/invoices.$invoiceId.ts`** — Server-side: tracks `invoice_updated` (PATCH) and `invoice_deleted` (DELETE) with session/distinct ID headers.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side: tracks `invoice_payment_processed` after successfully marking an invoice paid.

| Event name | Description | File |
|---|---|---|
| `dashboard_cta_clicked` | User clicks a call-to-action button on the home dashboard. | `src/routes/index.tsx` |
| `invoice_paid` | User marks an invoice as paid from the invoice detail view. | `src/routes/posts.$postId.tsx` |
| `invoice_details_viewed` | User navigates to the full invoice details page. | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid from the full invoice detail page. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks the Download PDF button on an invoice. | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User views a team member's profile page. | `src/routes/users.$userId.tsx` |
| `invoice_created` | A new invoice is created via the server-side API. | `src/routes/api/invoices.ts` |
| `invoice_updated` | An existing invoice is updated via the server-side API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | An invoice is deleted via the server-side API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_payment_processed` | An invoice payment is processed via the server-side pay endpoint. | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824679)
- [Invoice payments over time](https://us.posthog.com/project/483112/insights/xz3pRj3y) — Daily payment volume line chart
- [Invoice payment conversion funnel](https://us.posthog.com/project/483112/insights/YtbOtvk1) — Funnel from viewing details to paying
- [Invoice API operations breakdown](https://us.posthog.com/project/483112/insights/fCJuGxmu) — Stacked bar of all invoice CRUD operations
- [Dashboard CTA click breakdown](https://us.posthog.com/project/483112/insights/zQBkGLgo) — Which home page CTAs get the most clicks
- [Team member profile views](https://us.posthog.com/project/483112/insights/wW4OVDRo) — Daily team profile view trend

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
