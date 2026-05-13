<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. Here is a summary of all changes made:

- **`src/routes/__root.tsx`** — Added `PostHogProvider` from `@posthog/react` wrapping the root component. Configured with a reverse proxy host (`/ingest`), exception capture, and debug mode in development. Environment variables are used for the API key and host.
- **`vite.config.js`** — Added a reverse proxy configuration for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog traffic through the local Vite dev server, avoiding ad blockers.
- **`src/routes/login.tsx`** — Added `user_logged_in` event capture (with `posthog.identify()`) on login form submit, and `user_logged_out` event (with `posthog.reset()`) on sign out click.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `invoice_created` event capture when a new invoice is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `invoice_updated` event capture when invoice changes are saved.
- **`src/routes/_auth.profile.tsx`** — Added `upgrade_clicked` event capture on the Upgrade button in the subscription section.
- **`tsconfig.json`** — Added `"vite/client"` to the `types` array to support `import.meta.env` TypeScript types.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set to the correct project values.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to CloudFlow | `src/routes/login.tsx` |
| `user_logged_out` | User logs out of CloudFlow | `src/routes/login.tsx` |
| `invoice_created` | User submits a new invoice creation form | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/subscription page | `src/routes/_auth.profile.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Login trend** — Trend chart for `user_logged_in` over time. Shows daily active users and login volume.
2. **Logout trend** — Trend chart for `user_logged_out` over time. A spike relative to logins may indicate churn signals.
3. **Invoice creation funnel** — Funnel from `user_logged_in` → `invoice_created`. Shows what percentage of logged-in sessions result in a new invoice.
4. **Invoice activity** — Trend chart showing `invoice_created` and `invoice_updated` over time. Tracks product engagement with invoicing features.
5. **Upgrade click rate** — Trend chart for `upgrade_clicked`. Critical conversion event — track how often users express intent to upgrade from Free plan.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
