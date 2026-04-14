<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. The following changes were made:

- Installed `posthog-js` and `@posthog/react` packages
- Added a PostHog reverse proxy via Vite's dev server (`/ingest` → PostHog host) in `vite.config.js`
- Wrapped the root component in `PostHogProvider` in `src/routes/__root.tsx`, enabling automatic pageview tracking and session replay across all routes
- Added user identification (`posthog.identify`) on login, and `posthog.reset()` on logout
- Added event tracking for business-critical user actions: login, logout, invoice creation, invoice updates, and upgrade button clicks
- Created `src/vite-env.d.ts` to add Vite client type support for `import.meta.env`
- Configured environment variables in `.env` for the PostHog project token and host

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully submitted the login form and authenticated | `src/routes/login.tsx` |
| `user_logged_out` | User clicked the Sign Out button to end their session | `src/routes/login.tsx` |
| `invoice_created` | User successfully created a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User successfully saved changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button — top of upgrade conversion funnel | `src/routes/_auth.profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346453)
- [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/876Kj61f)
- [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/S7ZgfEVJ)
- [Subscription Revenue Events](https://us.posthog.com/project/2/insights/bxo4bUnw)
- [Churn Signals](https://us.posthog.com/project/2/insights/1GcEqNEk)
- [Team Growth Activity](https://us.posthog.com/project/2/insights/BVccAOVs)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
