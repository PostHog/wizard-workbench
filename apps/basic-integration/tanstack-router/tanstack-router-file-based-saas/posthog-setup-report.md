# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a TanStack Router (file-based) SaaS application. Changes include:

- **`vite.config.js`** – Converted to a function-based config and added a reverse proxy for `/ingest` routes so all PostHog traffic flows through the app domain (avoids ad-blockers).
- **`src/vite-env.d.ts`** – Added Vite client type reference so `import.meta.env` is properly typed across the project.
- **`src/routes/__root.tsx`** – Wrapped the root component in `PostHogProvider` (from `posthog-js/react`) with `capture_exceptions: true` for automatic error tracking.
- **`src/routes/login.tsx`** – Added `posthog.identify()` and `user_signed_in` capture on login; `user_signed_out` capture + `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** – Added `invoice_viewed` on mount, `invoice_updated` on successful save, `invoice_update_failed` on save error, and `invoice_notes_shown` when the notes panel is opened.
- **`src/routes/dashboard.users.route.tsx`** – Added `team_member_searched` on search input and `team_sort_changed` when the sort dropdown changes.
- **`src/routes/dashboard.users.user.tsx`** – Added `team_member_viewed` when a team member profile loads.
- **`src/routes/_auth.profile.tsx`** – Added `plan_upgrade_clicked` when the Upgrade button is clicked.
- **`src/routes/dashboard.index.tsx`** – Added `dashboard_viewed` on the main dashboard overview mount.
- **`.env`** – Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and successfully authenticates. | `src/routes/login.tsx` |
| `user_signed_out` | User clicks the Sign Out button from the login page. | `src/routes/login.tsx` |
| `invoice_viewed` | User opens an invoice detail page, marking the top of the invoice action funnel. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saves changes to an invoice by submitting the invoice detail form. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_update_failed` | An invoice update mutation returns an error, indicating a failed save. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_shown` | User toggles the internal notes section open on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_viewed` | User opens a team member profile card, marking the top of the member inspection funnel. | `src/routes/dashboard.users.user.tsx` |
| `team_member_searched` | User types in the team member search box to filter the list. | `src/routes/dashboard.users.route.tsx` |
| `team_sort_changed` | User changes the sort order of the team members list. | `src/routes/dashboard.users.route.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the profile/account settings page. | `src/routes/_auth.profile.tsx` |
| `dashboard_viewed` | User lands on the main dashboard overview, marking the top of the business metrics funnel. | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/2/dashboard/1720023)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
