<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. Here is a summary of all changes made:

- **`vite.config.js`** — Converted to the factory form of `defineConfig` and added a reverse-proxy configuration so all PostHog calls are routed through `/ingest` (both the API ingestion path and the `/static` / `/array` asset paths). This keeps PostHog traffic ad-blocker resistant.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is recognised by the TypeScript compiler.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (also ensured `.gitignore` coverage).
- **`src/main.tsx`** — Added `PostHogProvider` from `@posthog/react` wrapping the entire root route component so all child routes share the same PostHog client. Added `usePostHog()` hooks and event-capture calls across key components (see table below). Added `posthog.identify()` on login and `posthog.reset()` on logout for full user-session correlation. Enabled `capture_exceptions: true` for automatic error tracking.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User submits the login form to sign in to CloudFlow. | `src/main.tsx` |
| `user_logged_out` | User clicks the sign out button to log out of CloudFlow. | `src/main.tsx` |
| `invoice_created` | User submits the create invoice form successfully. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice successfully. | `src/main.tsx` |
| `invoice_viewed` | User opens a specific invoice detail page (top of payment funnel). | `src/main.tsx` |
| `invoice_notes_toggled` | User toggles the internal notes section on an invoice. | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account settings page. | `src/main.tsx` |
| `team_member_sorted` | User changes the sort order of the team members list. | `src/main.tsx` |
| `team_member_viewed` | User opens a team member profile page (top of team management funnel). | `src/main.tsx` |
| `dashboard_viewed` | User navigates to the dashboard overview page (top of engagement funnel). | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761350)
- [User logins over time](https://us.posthog.com/project/483112/insights/Dzo6j2ZD)
- [Invoice creation funnel](https://us.posthog.com/project/483112/insights/0yjaebwh)
- [Upgrade plan clicks](https://us.posthog.com/project/483112/insights/iRNuT3S7)
- [Login to invoice creation funnel](https://us.posthog.com/project/483112/insights/O9MIyS22)
- [Logins vs logouts](https://us.posthog.com/project/483112/insights/rSVf8I0W)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called at login time; if your app persists the session across page reloads (e.g. via localStorage), re-call `posthog.identify()` on app mount so returning authenticated sessions are not tracked anonymously.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
