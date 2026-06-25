<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (file-based routing) SaaS application. Changes include:

- **PostHog provider**: Added `PostHogProvider` from `@posthog/react` to `__root.tsx`, wrapping the entire app so all routes have access to PostHog.
- **Pageview tracking**: Added a `PostHogPageView` component in `__root.tsx` that fires `$pageview` on every route change using TanStack Router's built-in navigation state.
- **Reverse proxy**: Updated `vite.config.js` to proxy PostHog ingestion through `/ingest` so requests avoid ad-blockers.
- **Environment variables**: Created `.env` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. Added `src/vite-env.d.ts` for TypeScript awareness of these env vars.
- **User identification**: `posthog.identify()` is called in `login.tsx` on form submit, using the username as the distinct ID. `posthog.reset()` is called on sign-out.
- **Event capture**: 12 events instrumented across 5 files (see table below).

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form to sign in to CloudFlow. | `src/routes/login.tsx` |
| `user_signed_out` | User clicks the Sign Out button from the login page while already authenticated. | `src/routes/login.tsx` |
| `get_started_clicked` | User clicks the 'Go to Dashboard' call-to-action on the home page. | `src/routes/index.tsx` |
| `view_invoice_clicked` | User clicks the 'View Invoice' link in the pending items banner on the home page. | `src/routes/index.tsx` |
| `create_invoice_clicked` | User clicks the 'Create Invoice' quick action on the dashboard home. | `src/routes/dashboard.index.tsx` |
| `manage_team_clicked` | User clicks the 'Manage Team' quick action on the dashboard home. | `src/routes/dashboard.index.tsx` |
| `invoice_viewed` | User opens an individual invoice detail page, the top of the invoice edit funnel. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saves changes to an invoice by submitting the invoice details form. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggles the internal notes section on an invoice open or closed. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_searched` | User types in the team members search filter to find a specific person. | `src/routes/dashboard.users.route.tsx` |
| `team_sort_changed` | User changes the sort order of the team member list. | `src/routes/dashboard.users.route.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile page to move from the free plan. | `src/routes/_auth.profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1761358)
- [Login and invoice workflow funnel](https://us.i.posthog.com/project/483112/insights/P7EHWmrV)
- [Daily active sign-ins](https://us.i.posthog.com/project/483112/insights/isEqQruk)
- [Upgrade interest over time](https://us.i.posthog.com/project/483112/insights/RTAy1SmE)
- [Invoice activity over time](https://us.i.posthog.com/project/483112/insights/s9rA1ady)
- [User sign-out trend (churn signal)](https://us.i.posthog.com/project/483112/insights/lqNgwKBJagentId)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login; returning sessions that skip the login form will remain on anonymous distinct IDs until they sign in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
