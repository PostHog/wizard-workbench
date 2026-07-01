<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. PostHog is initialized via `PostHogProvider` in the root shell component (`src/routes/__root.tsx`), wrapping the full app so every route has access to the PostHog client. A Vite reverse proxy for `/ingest` was added to `vite.config.ts` to route PostHog requests through the dev server. A singleton server-side PostHog client was created at `src/utils/posthog-server.ts` using `posthog-node`. Environment variables are stored in `.env` and referenced via `import.meta.env` (client) and `process.env` (server). Seven events are tracked across six files, covering the invoice creation-to-payment funnel, detail engagement, and team management activity. Server-side event capture was added to the invoice pay API endpoint.

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form and a new invoice is successfully created. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on an invoice from the summary view. | `src/routes/posts.$postId.tsx` |
| `invoice_details_expanded` | User clicks View Full Details to open the expanded invoice detail page. | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on an invoice from the full detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button on the full invoice detail page. | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User opens a team member profile page (top of team management funnel). | `src/routes/users.$userId.tsx` |
| `invoice_paid` | Invoice payment is successfully processed on the server via the pay API endpoint. | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787560)
- [Invoice payment conversion funnel](https://us.posthog.com/project/483112/insights/mvY4LkY0)
- [Invoices created over time](https://us.posthog.com/project/483112/insights/vPVLuU8x)
- [Invoices marked paid over time](https://us.posthog.com/project/483112/insights/1jnkZZoO)
- [Invoice detail engagement](https://us.posthog.com/project/483112/insights/z4FIDsWa)
- [Team member profile views](https://us.posthog.com/project/483112/insights/QxclDYg4)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
