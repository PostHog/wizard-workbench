<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React + TanStack Router (file-based routing) SaaS application. The following changes were made:

- **Installed** `posthog-js` as a dependency
- **Configured** environment variables (`VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`) in `.env`
- **Added reverse proxy** in `vite.config.js` to route PostHog ingestion calls through `/ingest` (reduces ad-blocker impact)
- **Wrapped the app** with `PostHogProvider` in `src/routes/__root.tsx` with exception tracking and debug mode enabled
- **Added `vite/client` types** to `tsconfig.json` to support `import.meta.env`
- **Instrumented 7 business events** across 5 route files
- **Identified users** on login with `posthog.identify()` and reset on logout with `posthog.reset()`

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form to sign in | `src/routes/login.tsx` |
| `user_signed_out` | User clicks the Sign Out button to log out | `src/routes/login.tsx` |
| `invoice_created` | User submits the create invoice form | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile page | `src/routes/_auth.profile.tsx` |
| `team_members_filtered` | User types in the team members search/filter input | `src/routes/dashboard.users.route.tsx` |
| `team_members_sorted` | User changes the sort order of the team members list | `src/routes/dashboard.users.route.tsx` |

## Next steps

We've designed an **Analytics basics** dashboard for you to track user behavior. Create it in your PostHog project at https://us.posthog.com/project/2/dashboard with the following insights:

1. **User Sign-ins Over Time** — Trend chart for `user_signed_in` to track daily active users
2. **Invoice Creation Funnel** — Funnel from `user_signed_in` → `invoice_created` to measure conversion
3. **Upgrade Intent** — Trend chart for `upgrade_plan_clicked` to track revenue signals
4. **Churn Signals** — Trend chart for `user_signed_out` to identify logout patterns
5. **Team Engagement** — Combined trend for `team_members_filtered` + `team_members_sorted` to measure team management activity

Visit your PostHog project: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
