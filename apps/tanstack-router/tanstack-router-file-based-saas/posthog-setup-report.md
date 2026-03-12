<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router application. The following changes were made:

- **`vite.config.js`**: Added `/ingest` reverse proxy so PostHog requests are routed through the dev server (avoids ad-blockers).
- **`src/vite-env.d.ts`** *(new)*: Added Vite client type reference so `import.meta.env` works in TypeScript.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`src/routes/__root.tsx`**: Wrapped the app in `PostHogProvider` with session replay, exception capture, and a `PostHogPageView` component that fires `$pageview` on every TanStack Router navigation.
- **`src/routes/login.tsx`**: Added `user_logged_in` event with `posthog.identify()` on login, and `user_logged_out` with `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.index.tsx`**: Added `invoice_created` event when a new invoice is successfully created.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Added `invoice_updated` event when invoice changes are saved.
- **`src/routes/_auth.profile.tsx`**: Added `plan_upgrade_clicked` event when the Upgrade button is clicked.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to CloudFlow | `src/routes/login.tsx` |
| `user_logged_out` | User logs out of CloudFlow | `src/routes/login.tsx` |
| `invoice_created` | User creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the profile page | `src/routes/_auth.profile.tsx` |

## Next steps

To view analytics in PostHog, visit your project dashboard at:
- **PostHog Project**: https://us.posthog.com/project/2

Suggested insights to build in PostHog based on instrumented events:
- **Login Funnel**: `user_logged_in` → `invoice_created` (how many users create an invoice after signing in)
- **Invoice Activity**: Trend of `invoice_created` and `invoice_updated` over time
- **Plan Upgrade Clicks**: Trend of `plan_upgrade_clicked` (conversion to paid signal)
- **Daily Active Users**: Unique users per day via `$pageview`
- **User Retention**: Weekly retention cohort starting from `user_logged_in`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
