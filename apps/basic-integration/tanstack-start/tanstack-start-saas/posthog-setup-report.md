<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration covers both client-side and server-side event tracking, a reverse proxy for reliable ingestion, error tracking via `captureException`, and a PostHog dashboard with 5 business-critical insights.

**Changes made:**
- `vite.config.ts` — Added reverse proxy routes (`/ingest/static`, `/ingest/array`, `/ingest`) to route PostHog traffic through the Vite dev server, avoiding CORS issues.
- `src/routes/__root.tsx` — Wrapped the app shell with `PostHogProvider` (from `@posthog/react`) using environment variables for the API key and host.
- `src/utils/posthog-server.ts` (new) — Singleton `getPostHogClient()` using `posthog-node` for server-side event capture.
- `.env` — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- Client and server route files updated with `posthog.capture()` calls for business-critical events.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User successfully creates a new invoice from the Create Invoice form. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid from the invoice detail view. | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid from the full invoice detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks the Download PDF button on the full invoice detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User views a team member's profile page. | `src/routes/users.$userId.tsx` |
| `cta_clicked` | User clicks a primary call-to-action button on the home page. | `src/routes/index.tsx` |
| `invoice_paid_server` | Server-side event captured when an invoice payment is processed via the API. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Server-side event captured when a new invoice is created via the API. | `src/routes/api/invoices.ts` |
| `invoice_deleted_server` | Server-side event captured when an invoice is deleted via the API. | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1775203)
- **Invoice Creation Trend** — Line graph of `invoice_created` events over time
- **Invoice Payment Conversion Funnel** — Funnel from `invoice_created` → `invoice_marked_paid`
- **Invoice Actions Breakdown** — Bar chart of invoice_created, invoice_marked_paid, invoice_pdf_downloaded
- **Team Member Profile Views** — Line graph of `team_member_viewed` over time
- **CTA Clicks by Button** — Bar chart of `cta_clicked` broken down by `cta` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
