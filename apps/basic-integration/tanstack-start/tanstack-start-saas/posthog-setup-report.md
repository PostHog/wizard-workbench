<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration includes client-side event tracking via `PostHogProvider` in the root shell, server-side capture using a singleton `posthog-node` client for all API routes, automatic exception capture via `capture_exceptions: true` and explicit `captureException` calls, a Vite reverse proxy to route PostHog requests through `/ingest` for improved reliability, and five PostHog insights grouped in a dedicated dashboard.

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form and a new invoice is created. | `src/routes/posts.index.tsx` |
| `invoice_mark_as_paid_clicked` | User clicks the Mark as Paid button on an invoice detail page. | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | An invoice is successfully marked as paid via the server-side pay API endpoint. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button on the full invoice details page. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_deep_mark_as_paid_clicked` | User clicks Mark as Paid on the full invoice details deep page. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created_via_api` | An invoice is successfully created via the REST API POST endpoint. | `src/routes/api/invoices.ts` |
| `invoice_deleted_via_api` | An invoice is successfully deleted via the REST API DELETE endpoint. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_updated_via_api` | An invoice is successfully updated via the REST API PATCH endpoint. | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User opens a team member profile page, marking the start of the team member engagement funnel. | `src/routes/users.tsx` |
| `$exception` | Application errors caught by the default error boundary and the create-invoice error handler. | `src/components/DefaultCatchBoundary.tsx`, `src/routes/posts.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1760811)
- **Invoice creation and payment trend** (Trends): https://us.posthog.com/project/483112/insights/yP6glAMv
- **Invoice payment conversion funnel** (Funnel): https://us.posthog.com/project/483112/insights/gYBBsSuq
- **Team member engagement** (Trends): https://us.posthog.com/project/483112/insights/7UbCZDWz
- **Invoice management activity** (Trends bar): https://us.posthog.com/project/483112/insights/SoqdUgEG
- **Application errors over time** (Trends): https://us.posthog.com/project/483112/insights/DKvbKC9R

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
