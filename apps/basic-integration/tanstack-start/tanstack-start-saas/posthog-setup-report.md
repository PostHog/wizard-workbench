# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a TanStack Start SaaS application for invoicing and team management. The integration covers client-side event tracking (via `@posthog/react`), server-side event capture (via `posthog-node`), exception tracking, and a Vite reverse proxy for PostHog ingestion.

**Files created or modified:**

- `vite.config.ts` — Added `/ingest` proxy routes for PostHog (assets and ingestion)
- `src/utils/posthog-server.ts` — New singleton PostHog Node.js client for server-side use
- `src/routes/__root.tsx` — Added `PostHogProvider` wrapping the shell body
- `src/routes/posts.index.tsx` — Captures `invoice_create_submitted` on form submit
- `src/routes/posts.$postId.tsx` — Captures `invoice_viewed` on mount and `invoice_paid` on button click
- `src/routes/users.$userId.tsx` — Captures `team_member_viewed` on mount
- `src/components/DefaultCatchBoundary.tsx` — Calls `posthog.captureException()` on render
- `src/utils/invoices.ts` — Server functions capture `invoice_created` and `invoice_payment_processed`
- `src/routes/api/invoices.$invoiceId.pay.ts` — REST API captures `invoice_payment_api_processed`
- `src/routes/api/invoices.$invoiceId.ts` — REST API captures `invoice_updated` and `invoice_deleted`
- `.env` — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`

## Events tracked

| Event name | Description | File |
|---|---|---|
| `invoice_create_submitted` | User submits the new invoice creation form | `src/routes/posts.index.tsx` |
| `invoice_created` | Server function records a new invoice being created | `src/utils/invoices.ts` |
| `invoice_viewed` | User opens the invoice detail page (top of payment funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User clicks the Mark as Paid button | `src/routes/posts.$postId.tsx` |
| `invoice_payment_processed` | Server function confirms invoice payment | `src/utils/invoices.ts` |
| `invoice_payment_api_processed` | REST API endpoint records a successful payment | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted` | Invoice deleted via the REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_updated` | Invoice updated via the REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User views a team member's profile page | `src/routes/users.$userId.tsx` |
| `error_caught` | Application error caught by the global error boundary | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1761428)
- **Invoice payment conversion funnel**: [Funnel: invoice_viewed → invoice_paid](https://us.i.posthog.com/project/483112/insights/1lbzyzPi)
- **Invoice creation trend**: [Daily invoice_created events](https://us.i.posthog.com/project/483112/insights/XFHxvdmb)
- **Invoice actions breakdown**: [Created / paid / deleted / updated by week](https://us.i.posthog.com/project/483112/insights/4E6zuMlI)
- **Team member profile views**: [Daily team_member_viewed events](https://us.i.posthog.com/project/483112/insights/MWA9lMqN)
- **Application errors over time**: [Error tracking via $exception and error_caught](https://us.i.posthog.com/project/483112/insights/2iAGMQPi)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
