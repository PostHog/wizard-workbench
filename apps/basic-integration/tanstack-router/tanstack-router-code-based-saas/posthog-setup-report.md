<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a SaaS invoicing and team-management application built with React and TanStack Router (code-based routing).

## Changes made

### `vite.config.js`
Converted the config to a factory function and added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`), routing requests through Vite to avoid ad-blocker interference.

### `src/vite-env.d.ts` (new file)
Added Vite client type reference so `import.meta.env` resolves correctly in TypeScript.

### `src/main.tsx`
- Added `PostHogProvider` wrapping the entire app in `RootComponent`, configured with the project token, `/ingest` as the API host, exception capturing enabled, and debug mode in development.
- Added `posthog.identify()` at login with the username as the distinct ID.
- Added `posthog.reset()` at both logout locations to clear the identified user.
- Added `posthog.capture()` calls for all six tracked events (see table below).

### `.env`
Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Tracked events

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `posthog.identify()` | `src/main.tsx` |
| `user_logged_out` | User logs out; also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | New invoice successfully created (fires on mutation success) | `src/main.tsx` |
| `invoice_updated` | Existing invoice changes saved (fires on mutation success) | `src/main.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the Account/Profile page | `src/main.tsx` |
| `team_member_viewed` | User views a team member's profile page | `src/main.tsx` |

## Next steps

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
