<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. Here's a summary of all changes made:

- **`package.json`** — Added `posthog-js` dependency (installed via pnpm)
- **`tsconfig.json`** — Added `"types": ["vite/client"]` to support `import.meta.env` typings
- **`vite.config.js`** — Added a reverse proxy (`/ingest` → PostHog host) so analytics requests go through the app's own domain, improving ad-blocker resilience
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`
- **`src/routes/__root.tsx`** — Wrapped the entire app in `PostHogProvider` with session replay, exception capture, and debug mode in dev
- **`src/routes/login.tsx`** — Added `posthog.identify()` on login, `posthog.capture('user_logged_in')` on sign-in, and `posthog.capture('user_logged_out')` + `posthog.reset()` on sign-out
- **`src/routes/dashboard.invoices.index.tsx`** — Added `posthog.capture('invoice_created')` when the create invoice form is submitted
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `posthog.capture('invoice_updated')` when invoice changes are saved
- **`src/routes/_auth.profile.tsx`** — Added `posthog.capture('upgrade_plan_clicked')` when the Upgrade button is clicked

## Events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Used for tracking authentication conversions. | `src/routes/login.tsx` |
| `user_logged_out` | Fired when a user logs out. Used for tracking session churn. | `src/routes/login.tsx` |
| `invoice_created` | Fired when a user submits the new invoice form successfully. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the profile page. Top of upgrade conversion funnel. | `src/routes/_auth.profile.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key business metrics:

1. **Daily Active Users** — Trend of `user_logged_in` events over time, showing daily/weekly user engagement
2. **Login → Upgrade Funnel** — Funnel from `user_logged_in` → `upgrade_plan_clicked` to measure conversion from login to upgrade intent
3. **Invoice Activity** — Stacked trend of `invoice_created` and `invoice_updated` events to track productivity and engagement
4. **Session Churn** — Retention analysis using `user_logged_in` as the return event to understand re-engagement patterns
5. **Upgrade Click Rate** — `upgrade_plan_clicked` unique users as a percentage of `user_logged_in` unique users to track upgrade conversion rate

To create the dashboard, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard named "Analytics basics", then add insights based on the events above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
