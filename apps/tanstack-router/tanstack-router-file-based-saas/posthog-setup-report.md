<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Router application. Changes include:

- **Installed** `posthog-js` package
- **Added** `PostHogProvider` to `src/routes/__root.tsx` wrapping the entire app, enabling automatic pageview tracking, session replay, and error capture
- **Configured** a Vite reverse proxy in `vite.config.js` to route PostHog ingestion through `/ingest`, preventing ad-blockers from blocking analytics
- **Set up** environment variables `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in `.env`
- **Instrumented** 5 business-critical events across 3 routes with user identification on login

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user submits the login form; also calls `posthog.identify()` to associate the session with the username | `src/routes/login.tsx` |
| `user_logged_out` | Fired when a user clicks Sign Out; calls `posthog.reset()` to clear the session | `src/routes/login.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created, with `invoice_id` and `title` properties | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when an existing invoice is saved with changes, with `invoice_id` and `title` properties | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the Account Settings page, with `current_plan: 'free'` | `src/routes/_auth.profile.tsx` |

## Next steps

We've suggested the following insights for an "Analytics basics" dashboard to monitor key user behaviors. Visit PostHog to create them:

- **[New dashboard: Analytics basics](https://us.posthog.com/project/238460/dashboard)** — Create a new dashboard and add the insights below
- **Login funnel** — Trend of `user_logged_in` events over time: [Create insight](https://us.posthog.com/project/238460/insights/new)
- **Logout / churn signal** — Trend of `user_logged_out` events over time to track churn signals
- **Invoice creation rate** — Trend of `invoice_created` events — a core conversion event
- **Invoice updates** — Trend of `invoice_updated` events showing engagement with existing invoices
- **Upgrade intent** — Trend of `upgrade_plan_clicked` events to measure monetization interest

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
