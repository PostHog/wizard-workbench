<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (file-based) SaaS application. Here's what was set up:

- **PostHogProvider** added to `src/routes/__root.tsx`, wrapping the entire app and reading keys from environment variables via `import.meta.env`.
- **Vite reverse proxy** configured in `vite.config.js` to route PostHog ingestion through `/ingest`, keeping network requests first-party.
- **User identification** on login (`posthog.identify`) in `src/routes/login.tsx`, with `posthog.reset()` on logout. A persistent identity call in `src/routes/_auth.tsx` ensures returning visitors are identified on page refresh.
- **10 business events** instrumented across 6 files covering auth, invoice workflows, team management, and upgrade conversions.
- **Exception capture** enabled globally via `capture_exceptions: true` in the PostHogProvider config.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully submits the login form. | `src/routes/login.tsx` |
| `user_logged_out` | Fired when a logged-in user clicks the Sign Out button. | `src/routes/login.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created via the create invoice form. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when an existing invoice's details are successfully saved. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | Fired when the user opens or hides the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | Fired when the user clicks the Upgrade button on the profile/account settings page. | `src/routes/_auth.profile.tsx` |
| `dashboard_viewed` | Fired when the user lands on the dashboard overview page, marking the top of the business funnel. | `src/routes/dashboard.index.tsx` |
| `team_member_viewed` | Fired when the user opens a team member's profile page. | `src/routes/dashboard.users.user.tsx` |
| `team_members_sorted` | Fired when the user changes the sort order of the team members list. | `src/routes/dashboard.users.route.tsx` |
| `team_members_filtered` | Fired when the user types in the team members search/filter input. | `src/routes/dashboard.users.route.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813131)
- [User logins over time (wizard)](https://us.posthog.com/project/483112/insights/OanUMdoB)
- [Upgrade plan clicks (wizard)](https://us.posthog.com/project/483112/insights/WYFzUihJ)
- [Invoice activity (wizard)](https://us.posthog.com/project/483112/insights/cDm0eGR1)
- [Login to invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/AYAXcVFX)
- [User churn: logouts over time (wizard)](https://us.posthog.com/project/483112/insights/NW2JXpCt)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
