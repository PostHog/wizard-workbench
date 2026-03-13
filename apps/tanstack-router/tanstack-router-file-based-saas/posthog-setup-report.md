<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. Here's a summary of what was done:

- Installed `posthog-js` and configured a Vite reverse proxy for PostHog ingestion (`/ingest` → PostHog host).
- Added `PostHogProvider` in `src/routes/__root.tsx` wrapping the entire app with autocapture, session replay, exception tracking, and debug mode in development.
- Set up environment variables (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) in `.env`.
- Added `vite/client` types to `tsconfig.json` to support `import.meta.env`.
- Instrumented 6 business-critical events across 4 files.
- Added `posthog.identify()` on sign-in to correlate user sessions with identities.
- Added `posthog.reset()` on sign-out to clear the user session.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with their username | `src/routes/login.tsx` |
| `user_signed_out` | User signs out from their account | `src/routes/login.tsx` |
| `invoice_created` | User creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggles the internal notes section on an invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the profile/subscription page | `src/routes/_auth.profile.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **User Sign-ins Over Time** — Trends of `user_signed_in` events over the last 30 days. Helps monitor user growth and login activity.
   - [Create this insight →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_signed_in","type":"events"}],"insight":"TRENDS","date_from":"-30d"})

2. **Login → Invoice Creation Funnel** — Conversion funnel from `user_signed_in` → `invoice_created`. Tracks how many users who log in go on to create invoices.
   - [Create this insight →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_in","type":"events"},{"id":"invoice_created","type":"events"}]})

3. **Plan Upgrade Clicks** — Count of `plan_upgrade_clicked` events. Key churn-prevention metric showing upgrade interest.
   - [Create this insight →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"plan_upgrade_clicked","type":"events"}],"insight":"TRENDS","date_from":"-30d"})

4. **Invoice Activity** — Stacked trends of `invoice_created` and `invoice_updated`. Tracks overall invoice engagement.
   - [Create this insight →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"invoice_created","type":"events"},{"id":"invoice_updated","type":"events"}],"insight":"TRENDS","display":"ActionsBar"})

5. **Sign-in to Upgrade Funnel** — Funnel from `user_signed_in` → `plan_upgrade_clicked`. Tracks the proportion of users who discover and click the upgrade button.
   - [Create this insight →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_in","type":"events"},{"id":"plan_upgrade_clicked","type":"events"}]})

[Open PostHog Dashboard →](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
