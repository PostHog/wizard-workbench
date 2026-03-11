<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow React + TanStack Router (file-based routing) application.

**Summary of changes:**

- **`vite.config.js`** — Updated to use `defineConfig` with env loading and added a `/ingest` reverse proxy pointing to the PostHog host, so all analytics traffic routes through the local dev server (avoids ad-blockers and CORS issues).
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so TypeScript correctly recognizes `import.meta.env.*`.
- **`src/routes/__root.tsx`** — Wrapped the entire app in `PostHogProvider` (from `posthog-js/react`), configured with the project API key and host from environment variables, with exception capture and debug mode enabled in development.
- **`src/routes/login.tsx`** — Added `usePostHog()` hook. On login form submit: calls `posthog.identify()` to link the session to the username, then fires `user_logged_in`. On Sign Out button click: fires `user_logged_out` and calls `posthog.reset()` to unlink the session.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `usePostHog()` hook. On successful invoice creation: fires `invoice_created` with the new invoice's ID and title.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `usePostHog()` hook. On successful invoice save: fires `invoice_updated` with the invoice ID and title.
- **`src/routes/_auth.profile.tsx`** — Added `usePostHog()` hook. On Upgrade button click: fires `plan_upgrade_clicked` with the current plan name.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in by submitting the login form | `src/routes/login.tsx` |
| `user_logged_out` | User clicks the Sign Out button while already logged in | `src/routes/login.tsx` |
| `invoice_created` | User submits the create invoice form successfully | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the account settings page | `src/routes/_auth.profile.tsx` |

## Next steps

To set up your analytics dashboard, navigate to your PostHog project and create a new dashboard named **"Analytics basics"** with the following insights:

1. **Login trend** — Trend chart for `user_logged_in` over time (daily unique users signing in)
2. **Logout trend** — Trend chart for `user_logged_out` (potential churn signal)
3. **Invoice creation funnel** — Conversion funnel: `user_logged_in` → `invoice_created`
4. **Invoice activity** — Trend chart combining `invoice_created` and `invoice_updated` events
5. **Plan upgrade intent** — Trend chart for `plan_upgrade_clicked` (conversion funnel top indicator)

Open PostHog at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
