<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your CloudFlow TanStack Router (code-based) application. Changes include:

- **PostHogProvider**: Wrapped the root route component (`RootComponent`) with `PostHogProvider` from `@posthog/react`, initializing PostHog via a Vite reverse proxy (`/ingest`) so all traffic is routed through your own domain.
- **User identification**: `posthog.identify()` is called on login with the username as the distinct ID. `posthog.reset()` is called on every logout to cleanly separate sessions.
- **11 business events**: Captured across the login, invoice, team, and account flows (see table below).
- **Vite proxy**: `vite.config.js` updated to proxy `/ingest/*` to PostHog's ingest and asset CDN hosts via environment variables.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST` written to `.env`.
- **TypeScript**: Added `"types": ["vite/client"]` to `tsconfig.json` so `import.meta.env` resolves correctly.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user submits the login form and successfully authenticates. | `src/main.tsx` |
| `user_logged_out` | Fires when a user clicks the sign-out button (profile page or login page). | `src/main.tsx` |
| `invoice_created` | Fires when a user successfully creates a new invoice. | `src/main.tsx` |
| `invoice_updated` | Fires when a user successfully saves changes to an existing invoice. | `src/main.tsx` |
| `invoice_viewed` | Fires when a user opens an invoice detail page (top of conversion funnel). | `src/main.tsx` |
| `upgrade_plan_clicked` | Fires when a user clicks the Upgrade button on the account settings page. | `src/main.tsx` |
| `dashboard_viewed` | Fires when the dashboard overview loads (top of analytics funnel). | `src/main.tsx` |
| `team_member_viewed` | Fires when a user opens a team member's profile detail page. | `src/main.tsx` |
| `invoice_notes_toggled` | Fires when a user clicks 'Add Notes' or 'Hide Notes' on an invoice. | `src/main.tsx` |
| `user_search_performed` | Fires when a user types into the team member search field. | `src/main.tsx` |
| `user_sort_changed` | Fires when a user changes the sort order on the team members list. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- **Login & dashboard conversion funnel**: [nXypWKBt](https://us.posthog.com/project/483112/insights/nXypWKBt)
- **Invoice activity over time**: [t9pzdUl0](https://us.posthog.com/project/483112/insights/t9pzdUl0)
- **Upgrade plan clicks**: [e8ES3Qqz](https://us.posthog.com/project/483112/insights/e8ES3Qqz)
- **User login vs logout (churn signal)**: [HjxfECwM](https://us.posthog.com/project/483112/insights/HjxfECwM)
- **Team member & dashboard engagement**: [0SpBzS89](https://us.posthog.com/project/483112/insights/0SpBzS89)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
