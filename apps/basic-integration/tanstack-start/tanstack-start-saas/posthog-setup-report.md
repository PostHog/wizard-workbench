<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this TanStack Start project with PostHog for both client-side and server-side analytics. The setup adds PostHog initialization in the root route, a reusable server-side PostHog client, trusted API event capture for invoice lifecycle actions, client-side capture for invoice creation, invoice payment, invoice detail views, and team member views, plus exception capture in the default error boundary. Environment variables were added locally for the PostHog project token and host, and a dashboard with supporting insights was created in PostHog.

| Event name | Description | File |
| --- | --- | --- |
| invoice_created | Tracks when a new invoice is created from the invoice creation form. | src/routes/posts.index.tsx |
| invoice_paid | Tracks when a user marks an invoice as paid from the invoice detail view. | src/routes/posts.$postId.tsx |
| invoice_created_api | Tracks successful invoice creation on the server for trusted billing analytics. | src/routes/api/invoices.ts |
| invoice_updated_api | Tracks successful invoice updates on the server. | src/routes/api/invoices.$invoiceId.ts |
| invoice_deleted_api | Tracks successful invoice deletion on the server. | src/routes/api/invoices.$invoiceId.ts |
| invoice_paid_api | Tracks successful invoice payment on the server for authoritative payment completion analytics. | src/routes/api/invoices.$invoiceId.pay.ts |
| team_member_viewed | Tracks when a team member profile is opened from the team area. | src/routes/users.$userId.tsx |
| invoice_detail_viewed | Tracks when an invoice detail page is viewed as a funnel step before payment. | src/routes/posts.$postId.tsx |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807720
- Insight: Invoice detail to payment ratio — https://us.posthog.com/project/483112/insights/1LkCNEyL
- Insight: Invoice payment funnel — https://us.posthog.com/project/483112/insights/JvIgWzTr
- Insight: Server-side billing operations — https://us.posthog.com/project/483112/insights/RTw3RlsO
- Insight: Invoices created — https://us.posthog.com/project/483112/insights/8NG3VAaV
- Insight: Team member views — https://us.posthog.com/project/483112/insights/j0cMKotu

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
