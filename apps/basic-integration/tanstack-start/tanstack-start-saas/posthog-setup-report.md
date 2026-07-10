<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this TanStack Start project with PostHog. The integration added client-side initialization with `PostHogProvider`, a server-side singleton client using `posthog-node`, Vite reverse-proxy routing for browser ingestion, environment-variable based configuration, client and server event capture for invoice and team workflows, and exception capture in route error boundaries and server handlers. The SDKs were installed with pnpm, the `.env` file was updated with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, and the integration was verified with a production build.

| Event name | Description | File |
| --- | --- | --- |
| `invoice_created` | Tracks when a new invoice is created from the invoice creation flow. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | Tracks when a pending invoice is marked as paid from the invoice detail page. | `src/routes/posts.$postId.tsx` |
| `invoice_created_api` | Tracks successful invoice creation on the server for reliable conversion analytics. | `src/utils/invoices.ts`, `src/routes/api/invoices.ts` |
| `invoice_paid_api` | Tracks successful invoice payment updates on the server for reliable revenue workflow analytics. | `src/utils/invoices.ts`, `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_create_failed` | Tracks invoice creation failures in the client flow for troubleshooting and drop-off analysis. | `src/routes/posts.index.tsx` |
| `invoice_viewed` | Tracks when an invoice detail record is opened as a key funnel view event. | `src/routes/posts.$postId.tsx` |
| `team_directory_loaded` | Tracks when the team directory is successfully loaded on the server. | `src/utils/users.tsx` |
| `team_member_viewed` | Tracks when a team member profile is opened for inspection. | `src/routes/users.$userId.tsx` |
| `team_member_load_failed` | Tracks failed team member profile loads for debugging broken profile journeys. | `src/utils/users.tsx` |
| `api_invoices_listed` | Tracks successful invoice list API responses for server-side usage analysis. | `src/utils/invoices.ts`, `src/routes/api/invoices.ts` |
| `api_users_listed` | Tracks successful team list API responses for server-side usage analysis. | `src/routes/api/users.ts` |
| `api_user_viewed` | Tracks successful team member API responses for server-side usage analysis. | `src/routes/api/users.$userId.ts` |
| `invoice_payment_api_called` | Tracks invoice payment endpoint usage and outcomes on the server. | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831107)
- [Invoices created over time (wizard)](https://us.posthog.com/project/483112/insights/LgL1zsno)
- [Invoice payment funnel (wizard)](https://us.posthog.com/project/483112/insights/VowJvyAn)
- [Invoice payment endpoint calls (wizard)](https://us.posthog.com/project/483112/insights/PHmgFKb2)
- [Team member profile views (wizard)](https://us.posthog.com/project/483112/insights/XUgV6YSA)
- [Invoice create failures (wizard)](https://us.posthog.com/project/483112/insights/HBBcphMG)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
