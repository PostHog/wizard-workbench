<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (code-based) SaaS application. The following changes were made:

- **Installed** `posthog-js` and `@posthog/react` packages
- **Configured** `PostHogProvider` in the root route component (`RootComponent`) wrapping the entire app, with session replay, exception capture, and debug mode enabled
- **Set up** a Vite reverse proxy for PostHog ingestion via `/ingest` to avoid ad-blockers
- **Added** environment variables `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env`
- **Added** `"types": ["vite/client"]` to `tsconfig.json` so `import.meta.env` resolves correctly
- **Instrumented** 6 key business events across the user journey

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully signs in to CloudFlow; also calls `posthog.identify()` with username | `src/main.tsx` |
| `user_logged_out` | User signs out of CloudFlow; also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice (includes invoice ID and title) | `src/main.tsx` |
| `invoice_updated` | User successfully updates an existing invoice (includes invoice ID and title) | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on their account/profile page | `src/main.tsx` |
| `team_member_searched` | User types a search query in the Team Members search input | `src/main.tsx` |

## Next steps

To build insights in PostHog, visit your project and create a dashboard called **"Analytics basics"** with these suggested insights:

- **Login trend** — Trend of `user_logged_in` over time to track daily/weekly active users
- **Login → Invoice funnel** — Funnel from `user_logged_in` → `invoice_created` to measure conversion from login to first invoice
- **Invoice activity** — Combined trend of `invoice_created` and `invoice_updated` to track platform engagement
- **Upgrade intent** — Trend of `upgrade_plan_clicked` to monitor revenue conversion opportunities
- **Churn signal** — Trend of `user_logged_out` relative to `user_logged_in` to monitor session retention

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
