<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application. Here is a summary of the changes made:

- **`vite.config.js`** — Added a reverse proxy that routes `/ingest` to the PostHog host, so analytics traffic avoids ad blockers.
- **`src/routes/__root.tsx`** — Wrapped the entire app in `PostHogProvider` with `capture_exceptions: true` for automatic error tracking and `defaults: '2026-01-30'` for the latest SDK configuration.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/routes/login.tsx`** — Added `posthog.identify()` and `user_signed_in` capture on login form submit; `user_signed_out` capture + `posthog.reset()` on sign-out.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `invoice_created` capture on successful invoice creation mutation.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `invoice_updated` capture on successful invoice save mutation.
- **`src/routes/_auth.profile.tsx`** — Added `upgrade_plan_clicked` capture on the Upgrade button click.
- **`src/routes/dashboard.index.tsx`** — Added `dashboard_viewed` capture on mount (top of conversion funnel).

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully submits the login form | `src/routes/login.tsx` |
| `user_signed_out` | Fired when a user clicks the Sign Out button | `src/routes/login.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when an existing invoice is successfully saved | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the profile page | `src/routes/_auth.profile.tsx` |
| `dashboard_viewed` | Fired when a user views the main dashboard overview — top of conversion funnel | `src/routes/dashboard.index.tsx` |

## Next steps

Your PostHog project is ready to receive events. We recommend building an "Analytics basics" dashboard in PostHog with these five insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time, to track daily active users.
2. **Invoice creation funnel** — Funnel from `dashboard_viewed` → `invoice_created`, to measure conversion from landing on the dashboard to creating an invoice.
3. **Invoice activity** — Trends chart comparing `invoice_created` vs `invoice_updated` over time, to understand editing behavior.
4. **Upgrade click rate** — Trends chart for `upgrade_plan_clicked`, broken down by user, to identify upgrade intent.
5. **Churn signal** — Trends chart for `user_signed_out`, to monitor session-ending behavior over time.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
