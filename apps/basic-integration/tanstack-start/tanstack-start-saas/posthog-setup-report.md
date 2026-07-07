# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CloudFlow TanStack Start application. Changes include: initializing PostHog via `PostHogProvider` in the root shell component, configuring a Vite reverse proxy for PostHog ingestion, creating a server-side singleton PostHog Node.js client, adding client-side event captures for invoice creation and payment actions, adding server-side captures in the REST API routes, and wiring error tracking into the global error boundary.

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | Fired when a user submits the new invoice form on the client side. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | Fired when a user clicks Mark as Paid in the invoice details panel. | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired when a user clicks Mark as Paid in the full-page invoice details view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server-side tracking when an invoice is created via the REST API. | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server-side tracking when an invoice payment is processed via the REST API. | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813133)
- [Invoices created over time](https://us.posthog.com/project/483112/insights/yRlgxgZq)
- [Invoices paid over time](https://us.posthog.com/project/483112/insights/BqhCMNqg)
- [Invoice creation to payment funnel](https://us.posthog.com/project/483112/insights/s9gWgt78)
- [Invoices created by source](https://us.posthog.com/project/483112/insights/cfPKZ0ko)
- [Total invoices paid](https://us.posthog.com/project/483112/insights/O8dzcNkZ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
