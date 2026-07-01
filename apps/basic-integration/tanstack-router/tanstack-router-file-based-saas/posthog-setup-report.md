<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a SaaS invoicing and team management application built with React and TanStack Router (file-based routing). The following changes were made:

- **`vite.config.js`** — Updated to use `loadEnv` and added a Vite reverse proxy that routes PostHog ingestion requests through `/ingest`, eliminating direct third-party calls from the browser and helping avoid ad-blockers.
- **`src/routes/__root.tsx`** — Wrapped the entire app in `PostHogProvider` from `@posthog/react`, initialising PostHog with the project token and host from environment variables, enabling exception capture, and pointing traffic through the reverse proxy.
- **`src/routes/login.tsx`** — Added `usePostHog` to identify users on login (`posthog.identify`) and capture `user_logged_in` and `user_logged_out` events. `posthog.reset()` is called on logout to clear the anonymous session.
- **`src/routes/dashboard.invoices.index.tsx`** — Captures `invoice_created` (with invoice ID and title) when the create-invoice mutation succeeds.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Captures `invoice_viewed` (with invoice ID and payment status) on mount (top of conversion funnel) and `invoice_updated` when the update mutation succeeds.
- **`src/routes/_auth.profile.tsx`** — Captures `plan_upgrade_clicked` (with current plan and username) when the Upgrade button is clicked.
- **`src/routes/dashboard.users.user.tsx`** — Captures `team_member_viewed` (with team member ID and name) when a team member profile is opened.
- **`src/routes/dashboard.index.tsx`** — Captures `dashboard_quick_action_clicked` (with action name) when either quick-action link is clicked from the dashboard overview.
- **`src/vite-env.d.ts`** — Created to add the `vite/client` triple-slash reference so `import.meta.env` resolves correctly under TypeScript strict mode.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signed in with a username. | `src/routes/login.tsx` |
| `user_logged_out` | User clicked Sign Out to end their session. | `src/routes/login.tsx` |
| `invoice_created` | User submitted the form to create a new invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_viewed` | User opened an invoice detail page (top of funnel). | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saved changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `plan_upgrade_clicked` | User clicked the Upgrade button on the profile page. | `src/routes/_auth.profile.tsx` |
| `team_member_viewed` | User navigated to a team member's profile page. | `src/routes/dashboard.users.user.tsx` |
| `dashboard_quick_action_clicked` | User clicked a quick-action link on the dashboard overview. | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787556)

Insights on the dashboard:
- Sign-in trend — `user_logged_in` events over time
- Invoice creation trend — `invoice_created` events over time
- Invoice management funnel — `invoice_viewed` → `invoice_updated` conversion
- Plan upgrade clicks — total count of `plan_upgrade_clicked`
- User retention — weekly retention anchored on `user_logged_in`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current handler only identifies on fresh login, which can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
