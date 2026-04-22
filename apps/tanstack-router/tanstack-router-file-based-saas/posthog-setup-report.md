<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. The integration includes:

- **PostHog initialization**: `PostHogProvider` added to `src/routes/__root.tsx` wrapping the entire app, using environment variables for the project token and host.
- **Reverse proxy**: Vite dev server proxy configured in `vite.config.js` to route PostHog ingestion calls through `/ingest`, improving ad-blocker resistance.
- **Environment variables**: `.env` created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **User identification**: `posthog.identify()` called on login with the username as the distinct ID. `posthog.reset()` called on logout to clear the session.
- **Error tracking**: `capture_exceptions: true` enabled globally via `PostHogProvider` options.
- **Event tracking**: Five business-critical events instrumented across four files.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully submits the login form | `src/routes/login.tsx` |
| `user_logged_out` | Fired when a logged-in user clicks the Sign Out button | `src/routes/login.tsx` |
| `invoice_created` | Fired when a user successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when a user successfully saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the account settings page | `src/routes/_auth.profile.tsx` |

## Next steps

Visit your PostHog project to explore the data once users interact with the app. Recommended insights to build:

- **Login/logout trend**: Track `user_logged_in` and `user_logged_out` over time to monitor daily active users.
- **Invoice creation funnel**: `user_logged_in` → `invoice_created` to measure how many logged-in users create invoices.
- **Invoice activity**: Trend of `invoice_created` and `invoice_updated` to track business activity.
- **Upgrade intent**: Trend of `upgrade_plan_clicked` to measure conversion funnel from free to paid.
- **User retention**: Use `user_logged_in` as a retention baseline event.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
