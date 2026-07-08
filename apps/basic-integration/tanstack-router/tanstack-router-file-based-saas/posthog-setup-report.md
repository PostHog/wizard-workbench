# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (file-based) SaaS application. Changes include:

- **SDK installation**: Added `posthog-js` and `@posthog/react` packages.
- **Environment variables**: Created `.env` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **Reverse proxy**: Updated `vite.config.js` to route PostHog requests through `/ingest` for ad-blocker resilience.
- **Provider setup**: Wrapped the root layout in `PostHogProvider` (`src/routes/__root.tsx`) with `capture_exceptions: true` for error tracking.
- **User identification**: `posthog.identify()` on login, `posthog.reset()` on logout (`src/routes/login.tsx`).
- **Event capture**: 10 business-critical events across 5 route files.
- **TypeScript fix**: Added `src/vite-env.d.ts` to expose Vite's `import.meta.env` types.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User submits the login form and signs in. | `src/routes/login.tsx` |
| `user_logged_out` | User clicks Sign Out to end their session. | `src/routes/login.tsx` |
| `invoice_created` | User successfully submits the create invoice form. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_creation_failed` | Invoice creation mutation returns an error. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_update_failed` | Invoice update mutation returns an error. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggles the internal notes panel open or closed. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account page. | `src/routes/_auth.profile.tsx` |
| `team_member_sorted` | User changes the sort order of the team members list. | `src/routes/dashboard.users.route.tsx` |
| `dashboard_quick_action_clicked` | User clicks a quick action link from the dashboard overview. | `src/routes/dashboard.index.tsx` |

## Next steps

We've built a dashboard and five insights to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818328)
- [User logins over time (wizard)](https://us.posthog.com/project/483112/insights/aLGGsLIk)
- [Invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/bsco7ygr)
- [Upgrade plan clicks (wizard)](https://us.posthog.com/project/483112/insights/Z0hLKzQY)
- [Invoices created vs updated (wizard)](https://us.posthog.com/project/483112/insights/CzBm0vga)
- [Login-to-logout retention (wizard)](https://us.posthog.com/project/483112/insights/WpLgI64h)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
