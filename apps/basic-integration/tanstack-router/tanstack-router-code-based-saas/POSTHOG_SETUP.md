# PostHog Setup Report

## Completed

- Installed `@posthog/react` with pnpm.
- Configured the client-side SDK at the application entry point using `PostHogProvider`.
- Read the project token and host from Vite environment variables:
  - `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`
  - `VITE_PUBLIC_POSTHOG_HOST`
- Added user identification and login/logout tracking.
- Added invoice creation and update tracking with non-PII invoice IDs.
- Enabled exception capture through the SDK defaults/configuration.
- Added the event plan in `.posthog-events.json`.
- Verified the integration with `pnpm build`.

## Events

- `user_logged_in`
- `user_logged_out`
- `invoice_created`
- `invoice_updated`
- `invoice_mutation_failed` (planned, but mutation error capture was not added because the existing mutation abstraction does not expose an error callback without a broader unrelated refactor)

## Dashboard

Dashboard creation could not be completed because the PostHog MCP server was unavailable during this run. Reconnect the PostHog MCP server and create a dashboard for the events listed above.
