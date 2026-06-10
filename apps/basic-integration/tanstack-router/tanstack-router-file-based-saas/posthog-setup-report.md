<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router application. Here's a summary of all changes made:

- **`vite.config.js`** — Converted to factory function form and added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) to avoid ad-blocker interference.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so that `import.meta.env` is recognised by TypeScript.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/routes/__root.tsx`** — Wrapped the entire app in `<PostHogProvider>` so all routes have access to the PostHog client. Configured with the reverse proxy host, exception capture, and debug mode in development.
- **`src/routes/login.tsx`** — Added `posthog.identify()` on sign-in to tie events to the authenticated user. Added `posthog.capture('user_signed_in')` on login and `posthog.capture('user_signed_out')` + `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `posthog.capture('invoice_created')` in the mutation success callback with invoice ID and title as properties.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `posthog.capture('invoice_updated')` in the mutation success callback with invoice ID and title as properties.
- **`src/routes/_auth.profile.tsx`** — Added `posthog.capture('upgrade_clicked')` on the Upgrade button with the user's current plan and username as properties.

## Instrumented events

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to CloudFlow | `src/routes/login.tsx` |
| `user_signed_out` | User signs out of CloudFlow | `src/routes/login.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button to upgrade their plan | `src/routes/_auth.profile.tsx` |

## Next steps

We've instrumented the key events for CloudFlow. You can now build insights and dashboards in PostHog to monitor user behaviour:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — Create a new dashboard and add trend/funnel insights for the events above
- [PostHog Insights](https://us.posthog.com/project/2/insights) — Build individual trend and funnel charts, e.g.:
  - **Sign-in trend** — Track `user_signed_in` over time to monitor active authentication
  - **Churn funnel** — Track `user_signed_in` → `user_signed_out` to measure session duration
  - **Invoice creation trend** — Track `invoice_created` over time for business growth
  - **Upgrade conversion** — Track `upgrade_clicked` to measure upgrade intent

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
