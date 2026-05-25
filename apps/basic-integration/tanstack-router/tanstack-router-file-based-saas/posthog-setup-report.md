<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application, a React + TanStack Router (file-based routing) project.

## Changes made

- **`vite.config.js`** — Added a reverse proxy so PostHog requests route through `/ingest` locally, avoiding ad-blockers and keeping the host config flexible.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is properly typed.
- **`src/routes/__root.tsx`** — Wrapped the root component with `PostHogProvider`, initialising PostHog with the project token and host from environment variables, with exception capture and Vite proxy enabled.
- **`src/routes/login.tsx`** — Added `user_signed_in` capture + `posthog.identify()` on login, and `user_signed_out` capture + `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `invoice_created` capture with `invoice_id` and `title` on successful invoice creation.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `invoice_updated` capture with `invoice_id` and `title` on successful invoice save.
- **`src/routes/_auth.profile.tsx`** — Added `upgrade_clicked` capture with `plan` and `username` on the Upgrade button.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and authenticates | `src/routes/login.tsx` |
| `user_signed_out` | User clicks Sign Out to log out of the app | `src/routes/login.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/account page | `src/routes/_auth.profile.tsx` |

## Next steps

We've set up the event tracking. Build insights and a dashboard for user behaviour in PostHog using the events above:

- [Create a new dashboard in PostHog](/dashboard)
- Suggested insights to build:
  - **Sign-in trend** — Trends chart for `user_signed_in` over time
  - **Sign-in → Upgrade funnel** — Funnel from `user_signed_in` → `upgrade_clicked` (conversion rate)
  - **Invoice creation trend** — Trends chart for `invoice_created` over time
  - **Invoice workflow funnel** — Funnel from `invoice_created` → `invoice_updated`
  - **Churn signal** — Trends chart for `user_signed_out` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
