<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. The integration covers client-side event tracking via `posthog-js` with a `PostHogProvider` in the root route, server-side event tracking via `posthog-node` for the REST API endpoints, a Vite reverse proxy to route PostHog requests through the app server, error capture in the global error boundary, and an analytics dashboard with five business-critical insights.

**Changes made:**
- Created `src/utils/posthog-server.ts` — singleton `posthog-node` client for server-side tracking
- Updated `src/routes/__root.tsx` — wrapped the app in `PostHogProvider` with reverse proxy config and error capture enabled
- Updated `vite.config.ts` — added `/ingest` reverse proxy routes for PostHog assets and events
- Updated `src/routes/posts.index.tsx` — captures `invoice_created` event on successful form submission
- Updated `src/routes/posts.$postId.tsx` — captures `invoice_viewed` (funnel entry) and `invoice_paid` (conversion)
- Updated `src/routes/users.$userId.tsx` — captures `team_member_viewed` event
- Updated `src/routes/index.tsx` — captures `get_started_clicked` with destination property on CTA clicks
- Updated `src/routes/api/invoices.ts` — server-side `invoice_created` capture on POST
- Updated `src/routes/api/invoices.$invoiceId.pay.ts` — server-side `invoice_paid` capture on POST
- Updated `src/routes/api/invoices.$invoiceId.ts` — server-side `invoice_updated` and `invoice_deleted` captures
- Updated `src/components/DefaultCatchBoundary.tsx` — calls `posthog.captureException(error)` for global error tracking
- Added environment variables `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env`

| Event name | Description | File |
|---|---|---|
| `invoice_created` | User successfully submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_viewed` | User opens an invoice detail page (top of payment funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User clicks 'Mark as Paid' and the update succeeds | `src/routes/posts.$postId.tsx` |
| `team_member_viewed` | User views a team member's profile page | `src/routes/users.$userId.tsx` |
| `get_started_clicked` | User clicks a primary CTA on the home dashboard | `src/routes/index.tsx` |
| `invoice_created` | Invoice created via REST API POST (server-side) | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice paid via REST API (server-side) | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice updated via REST API PATCH (server-side) | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice deleted via REST API DELETE (server-side) | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/481547/dashboard/1746268)
- [Invoices created over time](https://us.posthog.com/project/481547/insights/9502869)
- [Invoice payment conversion funnel](https://us.posthog.com/project/481547/insights/9502875)
- [Invoices paid over time](https://us.posthog.com/project/481547/insights/9502876)
- [Dashboard CTA clicks](https://us.posthog.com/project/481547/insights/9502879)
- [Team member views](https://us.posthog.com/project/481547/insights/9502888)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
