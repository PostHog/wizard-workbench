<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **`vite.config.js`**: Updated to use `defineConfig` with `loadEnv` and added a Vite dev-server reverse proxy routing `/ingest`, `/ingest/static`, and `/ingest/array` through to PostHog, improving ad-blocker resilience and reducing CORS issues.
- **`src/routes/__root.tsx`**: Wrapped the entire app in `PostHogProvider` (from `posthog-js/react`) with session replay, error tracking (`capture_exceptions: true`), and debug mode in development.
- **`src/routes/login.tsx`**: Added `user_signed_in` event (with `posthog.identify()` to associate the username with the PostHog distinct ID) and `user_signed_out` event (with `posthog.reset()` to clear the session).
- **`src/routes/dashboard.invoices.index.tsx`**: Added `invoice_created` event when a new invoice is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Added `invoice_updated` event when invoice changes are saved.
- **`src/routes/_auth.profile.tsx`**: Added `upgrade_clicked` event when the Upgrade button on the account settings page is clicked.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set correctly.
- **`posthog-js`**: Installed as a dependency.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with a username | `src/routes/login.tsx` |
| `user_signed_out` | User signs out of the application | `src/routes/login.tsx` |
| `invoice_created` | User creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/account settings page | `src/routes/_auth.profile.tsx` |

## Next steps

We were unable to create the "Analytics basics" dashboard automatically because the available API key does not have `dashboard:write` or `insight:write` scopes. You can create it manually in PostHog:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard/new) — name it **"Analytics basics"**

Suggested insights to add to the dashboard:

- [Sign-in trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_signed_in","name":"user_signed_in","type":"events","order":0}]) — track `user_signed_in` over time
- [Sign-in to invoice creation funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"user_signed_in","name":"user_signed_in","type":"events","order":0},{"id":"invoice_created","name":"invoice_created","type":"events","order":1}]) — conversion from sign-in to invoice creation
- [Invoice activity trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"invoice_created","name":"invoice_created","type":"events","order":0},{"id":"invoice_updated","name":"invoice_updated","type":"events","order":1}]) — `invoice_created` and `invoice_updated` together
- [Upgrade conversion trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"upgrade_clicked","name":"upgrade_clicked","type":"events","order":0}]) — `upgrade_clicked` over time
- [Churn signal: sign-out trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_signed_out","name":"user_signed_out","type":"events","order":0}]) — `user_signed_out` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
