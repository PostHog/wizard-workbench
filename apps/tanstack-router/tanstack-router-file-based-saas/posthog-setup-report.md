<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Router (file-based) application. Here is a summary of every change made:

- **Installed** `@posthog/react` and `posthog-js` via pnpm.
- **Environment variables** written to `.env`: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`tsconfig.json`**: Added `"types": ["vite/client"]` so `import.meta.env` is typed correctly.
- **`vite.config.js`**: Converted to function form with `loadEnv` and added a `/ingest` reverse-proxy to forward PostHog requests through your own domain — this improves reliability and ad-blocker resistance.
- **`src/routes/__root.tsx`**: Wrapped the entire app with `PostHogProvider` (from `@posthog/react`). PostHog is initialised once here with `capture_exceptions: true` for automatic error tracking.
- **`src/routes/login.tsx`**: Added `user_logged_in` event with `posthog.identify()` on sign-in, and `user_logged_out` with `posthog.reset()` on sign-out.
- **`src/routes/dashboard.invoices.index.tsx`**: Added `invoice_created` event when the create-invoice form is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Added `invoice_updated` event when an invoice's changes are saved, including `invoice_id`, `title`, and `amount` properties.
- **`src/routes/_auth.profile.tsx`**: Added `upgrade_plan_clicked` event on the Upgrade button, capturing `current_plan` and `username`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User signs in to the app. Calls `posthog.identify()` with username. | `src/routes/login.tsx` |
| `user_logged_out` | User signs out of the app. Calls `posthog.reset()` after capture. | `src/routes/login.tsx` |
| `invoice_created` | User submits the create invoice form successfully. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account settings page. | `src/routes/_auth.profile.tsx` |

## Next steps

We've recommended the following insights for an **"Analytics basics"** dashboard to monitor user behavior based on the events instrumented above. Create it at:

- **Dashboard**: https://us.posthog.com/project/2/dashboard

Suggested insights to add to the dashboard:

1. **Daily active users** — Trends: unique users over time (`$pageview`)
2. **Login funnel** — Funnel: `user_logged_in` → `invoice_created` (measures onboarding conversion)
3. **Invoice creation rate** — Trends: `invoice_created` events over time
4. **Invoice update rate** — Trends: `invoice_updated` events over time
5. **Upgrade intent** — Trends: `upgrade_plan_clicked` events over time (key churn/expansion signal)

You can create each insight from **Insights → New insight** in your PostHog project, then pin them to the dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
