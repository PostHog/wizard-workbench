<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React SaaS app using TanStack Router (file-based routing). Changes include: initializing PostHog via `PostHogProvider` in the root route (`__root.tsx`), configuring a Vite reverse proxy for PostHog ingestion, setting environment variables for the project token and host, adding user identification on login, resetting PostHog identity on logout, and instrumenting nine business-critical events across six route files.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to CloudFlow. | `src/routes/login.tsx` |
| `user_logged_out` | User signs out of CloudFlow. | `src/routes/login.tsx` |
| `invoice_created` | User submits the form to create a new invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_viewed` | User opens an invoice detail page (top of conversion funnel). | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User shows or hides the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account/profile page. | `src/routes/_auth.profile.tsx` |
| `team_member_viewed` | User opens a team member profile page. | `src/routes/dashboard.users.user.tsx` |
| `dashboard_quick_action_clicked` | User clicks a quick action link on the dashboard overview. | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics Dashboard](https://us.i.posthog.com/project/483112/dashboard/1751155) — user logins trend, invoice completion funnel, invoice creation rate, upgrade clicks, and quick action breakdown

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
