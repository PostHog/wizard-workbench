<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. Here is a summary of the changes made:

- **`vite.config.js`** — Converted to a function-style config using `loadEnv` and added a `/ingest` reverse proxy for PostHog ingestion, routing traffic through the Vite dev server to avoid ad-blockers.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` to enable `import.meta.env` type support.
- **`src/main.tsx`** — Added `PostHogProvider` wrapping `RootComponent` with the project token, ingest proxy host, exception capture, and debug mode. Added `usePostHog()` calls in `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, and `InvoiceComponent` to capture all five business-critical events. Login also calls `posthog.identify()` to tie events to a named user, and logout calls `posthog.reset()` to clear the session.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (git-ignored).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully submits the login form; also calls `posthog.identify()` | `src/main.tsx` |
| `user_logged_out` | Fired when a user clicks Sign Out (profile page or login screen); also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created, with `invoice_id` and `title` properties | `src/main.tsx` |
| `invoice_updated` | Fired when an existing invoice is successfully saved, with `invoice_id` and `title` properties | `src/main.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on the Account/Profile page | `src/main.tsx` |

## Next steps

To view and build on these analytics, visit your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Login funnel** — `user_logged_in` → `invoice_created` (conversion from login to first invoice)
- **Upgrade intent** — Unique users who triggered `upgrade_clicked`
- **Invoice activity** — Total `invoice_created` and `invoice_updated` events over time
- **Churn signal** — Users who triggered `user_logged_out` without creating an invoice
- **Active users** — Unique users per day based on `user_logged_in`

You can build these at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
