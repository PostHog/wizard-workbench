<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **Installed** `@posthog/react` as a dependency.
- **Created** `.env` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST`.
- **Created** `src/vite-env.d.ts` to add Vite client type definitions.
- **Updated** `vite.config.js` to add a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) using only environment variables — no hardcoded hosts.
- **Updated** `src/main.tsx` to:
  - Wrap `RootComponent` with `PostHogProvider` (with `capture_exceptions: true` for error tracking).
  - Call `posthog.identify()` and capture `user_signed_in` when the login form is submitted.
  - Capture `user_signed_out` and call `posthog.reset()` on both Sign Out buttons (LoginComponent and ProfileComponent).
  - Capture `upgrade_plan_clicked` on the Upgrade button in ProfileComponent.
  - Capture `invoice_created` (with title) in the `onSuccess` callback of the create invoice mutation.
  - Capture `invoice_updated` (with invoice ID and title) in the `onSuccess` callback of the update invoice mutation.
  - Capture `invoice_notes_toggled` (with invoice ID and action) when the notes toggle link is clicked.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully submitted the login form and signed in | `src/main.tsx` |
| `user_signed_out` | User clicked Sign Out from the profile page or login page | `src/main.tsx` |
| `invoice_created` | User submitted the create invoice form successfully | `src/main.tsx` |
| `invoice_updated` | User saved changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button on the account/profile page — key conversion event | `src/main.tsx` |
| `invoice_notes_toggled` | User toggled the internal notes section on an invoice detail view | `src/main.tsx` |

## Next steps

The PostHog API key used by the MCP server is missing the `dashboard:write`, `insight:write`, and `query:read` scopes, so the dashboard could not be created automatically. To create an **"Analytics basics"** dashboard manually, visit your PostHog project and create the following insights:

- **Sign-in funnel**: Funnel from `user_signed_in` → `invoice_created` to measure activation rate.
- **Upgrade clicks trend**: Trends chart of `upgrade_plan_clicked` over time to track conversion intent.
- **Invoice creation trend**: Trends chart of `invoice_created` over time.
- **Invoice update trend**: Trends chart of `invoice_updated` over time.
- **Sign-out trend**: Trends chart of `user_signed_out` to monitor churn signals.

Visit [Dashboards](/dashboard) in your PostHog project to get started.

To add the missing scopes, go to [Settings → Personal API Keys](/settings/user-api-keys) and update the key used by your MCP server.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
