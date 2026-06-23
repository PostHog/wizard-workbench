<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration includes client-side analytics via `PostHogProvider` and `usePostHog` hooks, server-side event tracking via a singleton `posthog-node` client, a Vite reverse proxy for PostHog ingestion, automatic exception capture on critical user flows, and session correlation headers so server-side events are linked to client-side sessions.

## Changes summary

| File | Change |
|------|--------|
| `vite.config.ts` | Added PostHog reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` |
| `src/routes/__root.tsx` | Wrapped shell with `PostHogProvider` (client-side init, exception capture enabled) |
| `src/utils/posthog-server.ts` | Created singleton PostHog Node.js client for server-side tracking |
| `src/routes/posts.index.tsx` | Captures `invoice_created` on successful form submission |
| `src/routes/posts.$postId.tsx` | Captures `invoice_marked_paid` from the invoice detail panel |
| `src/routes/posts_.$postId.deep.tsx` | Captures `invoice_marked_paid` and `invoice_pdf_download_clicked` |
| `src/routes/index.tsx` | Captures `home_cta_clicked` with `cta` property for each CTA button |
| `src/routes/api/invoices.ts` | Server-side `invoice_created` via REST API POST |
| `src/routes/api/invoices.$invoiceId.pay.ts` | Server-side `invoice_paid` via REST API POST |
| `src/routes/api/invoices.$invoiceId.ts` | Server-side `invoice_updated` (PATCH) and `invoice_deleted` (DELETE) via REST API |

## Events

| Event name | Description | File |
|------------|-------------|------|
| `invoice_created` | User successfully creates a new invoice through the form | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid from the detail panel | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid from the full details view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button | `src/routes/posts_.$postId.deep.tsx` |
| `home_cta_clicked` | User clicks a CTA button on the home page | `src/routes/index.tsx` |
| `invoice_created` | Invoice created via REST API (server-side) | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice marked paid via REST API (server-side) | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice updated via REST API (server-side) | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice deleted via REST API (server-side) | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/2/dashboard/9000002)
- [Invoice Creation Trend](https://us.posthog.com/project/2/insights/WZ00004) — track invoice creation volume over time
- [Invoice Payment Funnel](https://us.posthog.com/project/2/insights/WZ00005) — conversion from `invoice_created` to `invoice_marked_paid`
- [Home CTA Click Breakdown](https://us.posthog.com/project/2/insights/WZ00006) — compare "View Invoices" vs "Manage Team" CTA engagement
- [Invoice Lifecycle Trends](https://us.posthog.com/project/2/insights/WZ00007) — multi-series view of created, paid, and deleted invoices
- [Invoice PDF Download Rate](https://us.posthog.com/project/2/insights/WZ00008) — track download intent per invoice

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
