<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. Here is a summary of all changes made:

- **`vite.config.js`**: Updated to use `defineConfig` with `loadEnv`, and added a reverse proxy for PostHog ingestion (`/ingest/static`, `/ingest/array`, `/ingest`) routing traffic through your Vite dev server to avoid ad-blocker interference.
- **`src/main.tsx`**: Added `PostHogProvider` from `@posthog/react` wrapping the entire app in `RootComponent`. Added `usePostHog()` calls in five components to capture business-critical events. User identification (`posthog.identify`) is called at login so all subsequent events are linked to the correct user. `posthog.reset()` is called on logout to clear the identity.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Calls `posthog.identify` with username. | `src/main.tsx` |
| `user_logged_out` | Fired when a user logs out. Calls `posthog.reset()` to clear identity. | `src/main.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created. Includes `invoice_id` and `invoice_title`. | `src/main.tsx` |
| `invoice_updated` | Fired when an invoice is successfully saved. Includes `invoice_id` and `invoice_title`. | `src/main.tsx` |
| `invoice_viewed` | Fired when a user opens an invoice detail page. Top of the invoice engagement funnel. | `src/main.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the Account/Profile page. High-value conversion signal. | `src/main.tsx` |
| `team_member_viewed` | Fired when a user views a team member profile. Indicates team management engagement. | `src/main.tsx` |

## Next steps

Create the "Analytics basics" dashboard and add insights to monitor user behavior:

- **Dashboard**: [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)
- **Insight 1 – User logins trend**: [View in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_logged_in","type":"events"}]&date_from=-30d)
- **Insight 2 – Invoice creation trend**: [View in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"invoice_created","type":"events"}]&date_from=-30d)
- **Insight 3 – Invoice engagement funnel** (invoice_viewed → invoice_created): [View in PostHog](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"invoice_viewed","type":"events"},{"id":"invoice_created","type":"events"}]&date_from=-30d)
- **Insight 4 – Upgrade plan clicks**: [View in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"upgrade_plan_clicked","type":"events"}]&date_from=-30d)
- **Insight 5 – Logout / churn signal**: [View in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_logged_out","type":"events"}]&date_from=-30d)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
