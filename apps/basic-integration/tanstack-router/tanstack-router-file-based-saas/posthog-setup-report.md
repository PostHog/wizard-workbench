<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (file-based) SaaS application. The integration adds `@posthog/react` and `posthog-js`, wraps the root route with `PostHogProvider` via a Vite reverse proxy, identifies users on login, resets on logout, and captures seven key business events across five files. Error tracking is enabled via `capture_exceptions: true` in the init config. The integration is guarded so a missing PostHog token never breaks the app in production, but logs a clear error in development.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully submits the login form and is authenticated. | `src/routes/login.tsx` |
| `user_logged_out` | Fired when a logged-in user clicks the Sign Out button. | `src/routes/login.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created via the create invoice form. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when an existing invoice's details are saved successfully. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | Fired when a user shows or hides the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `subscription_upgrade_clicked` | Fired when a user clicks the Upgrade button on the profile/account settings page. | `src/routes/_auth.profile.tsx` |
| `team_member_searched` | Fired when a user applies a search filter in the team members list. | `src/routes/dashboard.users.route.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901926)
- [Login funnel (wizard)](https://us.posthog.com/project/483112/insights/d1FvDmej)
- [Invoice activity (wizard)](https://us.posthog.com/project/483112/insights/icoLELjE)
- [Upgrade button clicks (wizard)](https://us.posthog.com/project/483112/insights/FgpxXpsB)
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/35Y5H4qk)
- [User retention after login (wizard)](https://us.posthog.com/project/483112/insights/D39UGJff)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
