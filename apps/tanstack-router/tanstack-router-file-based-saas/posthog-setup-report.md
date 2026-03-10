<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router SaaS application. The following changes were made:

- **`vite.config.js`**: Updated to use `defineConfig` with a function signature and added a reverse proxy for PostHog ingestion (`/ingest` → PostHog host) to avoid ad blockers.
- **`tsconfig.json`**: Added `"types": ["vite/client"]` to enable `import.meta.env` TypeScript support.
- **`src/routes/__root.tsx`**: Wrapped the root component with `PostHogProvider` from `posthog-js/react`, initializing PostHog with the project API key from environment variables, exception capture enabled, and the reverse proxy host.
- **`src/routes/login.tsx`**: Added `posthog.identify()` and `posthog.capture('user_logged_in')` on form submit, and `posthog.capture('user_logged_out')` + `posthog.reset()` on sign-out button click.
- **`src/routes/dashboard.invoices.index.tsx`**: Added `posthog.capture('invoice_created')` in the `onSuccess` callback of the create invoice mutation.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Added `posthog.capture('invoice_updated')` in the `onSuccess` callback of the update invoice mutation.
- **`src/routes/dashboard.index.tsx`**: Added `posthog.capture('dashboard_viewed')` using TanStack Router's `onEnter` lifecycle hook to capture the top-of-funnel event.
- **`src/routes/_auth.profile.tsx`**: Added `posthog.capture('upgrade_plan_clicked')` on the Upgrade button click, a critical conversion event.

Environment variables (`VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`) were written to `.env` and are referenced via `import.meta.env` in the code.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in to CloudFlow | `src/routes/login.tsx` |
| `user_logged_out` | User logged out of CloudFlow | `src/routes/login.tsx` |
| `invoice_created` | User successfully created a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saved changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `dashboard_viewed` | User viewed the main dashboard (top of conversion funnel) | `src/routes/dashboard.index.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button on the profile/account page | `src/routes/_auth.profile.tsx` |

## Next steps

You can now explore your analytics in PostHog. Here are some suggested insights to build on your "Analytics basics" dashboard:

1. **Login trend** – Trend of `user_logged_in` over time (DAU/WAU)
2. **Invoice creation funnel** – Funnel: `dashboard_viewed` → `invoice_created`
3. **Upgrade conversion rate** – Unique users who triggered `upgrade_plan_clicked` vs `user_logged_in`
4. **Invoice activity** – Trend of `invoice_created` and `invoice_updated` over time
5. **Churn signal** – Users who triggered `user_logged_out` without `invoice_created` in the same session

Navigate to your [PostHog project](https://us.posthog.com/project/2) to start building these insights and add them to a dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
