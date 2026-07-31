# PostHog setup report

PostHog Node.js analytics was added to the Koa notes API with five CRUD events, global error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` (`^5.47.2`) with npm; `dotenv` (`^17.4.2`) was also added so local `.env` values load at startup.
- `posthog.js` loads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment and exports one shared `PostHog` client. It enables `enableExceptionAutocapture: true` and fails loudly in non-production when either required variable is missing; production exports `null` instead of breaking the app.
- The real environment values were configured in `.env`; `.env.example` documents the variable names. No secret values are included in this report.
- No browser SDK or reverse proxy was added because this is a server-side Koa application.

## Events instrumented

The following captures are placed in `index.js` immediately after their successful state mutations. The run verified the call sites and event contract; it did **not** run the API or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `folder_created` | A new notes folder was successfully created | `index.js` (around line 39) |
| `folder_deleted` | A non-default folder was deleted and its notes moved to General | `index.js` (around line 69) |
| `note_created` | A new note was successfully created | `index.js` (around line 111) |
| `note_updated` | An existing note was successfully updated | `index.js` (around line 155) |
| `note_deleted` | An existing note was successfully deleted | `index.js` (around line 181) |

Event properties use internal folder/note IDs and non-content metadata. Titles, names, note contents, and other user-entered content are not captured.

## Identification

User identification was skipped. The API has no authentication, users, sessions, or proven stable user identifier, so the integration intentionally does not invent a distinct ID or use untrusted request data as identity. The five CRUD events are therefore personless. If authentication is added later, use the authenticated account primary key at the Koa request boundary—never an email or name.

## Error tracking

`index.js` registers one global `app.on('error')` handler (around lines 7–12). When the shared client is configured, it calls `posthog.captureException(err)` and awaits `posthog.flush()`, feeding uncaught Koa errors to PostHog Error Tracking. No error has been intentionally triggered or observed arriving during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935615)

The dashboard contains five tagged insights for the CRUD events and is configured for the last 30 days. The dashboard and insights were created successfully, but the dashboard is expected to remain empty until the application sends events; event delivery was not verified by this run.

## What the run verified—and did not

Verified: dependencies installed cleanly with zero reported vulnerabilities; environment keys were present; the shared client, five capture call sites, error handler, event contract, and dashboard configuration were recorded or inspected. The package manifest has only `start` and `dev` scripts, with no build, typecheck, or lint script, so no such verification ran. The server and test suite were also not run. Consequently, compilation, runtime boot, request behavior, event delivery, and error-event delivery remain unconfirmed.

## Build conflicts

No build conflict was reported. A build could not be run because `package.json` defines no build, typecheck, or lint command. The review also did not run the server or test suite. The runtime must satisfy `posthog-node`'s declared Node 20+ engine requirement.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`.
2. Run the API and exercise successful folder and note create/update/delete routes, then confirm the five event names arrive in PostHog and populate the dashboard.
3. Trigger a controlled Koa application error and confirm it appears in PostHog Error Tracking.
4. Add authenticated identity later only when a stable account identifier exists.
5. Confirm the deployment runtime uses Node 20 or newer.

## Before you merge

- [ ] Run a full production/build-equivalent check and fix any errors introduced by the instrumentation; inspect `package.json` scripts and `index.js`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the PostHog import and captures in `index.js`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in deployment environments, checking the names documented in `.env.example` and used in `posthog.js`; do not rely on local `.env` alone.
- [ ] Exercise the five mutation routes in `index.js` and confirm `folder_created`, `folder_deleted`, `note_created`, `note_updated`, and `note_deleted` arrive in PostHog before relying on the dashboard.
- [ ] Trigger and verify an application error through the `app.on('error')` handler in `index.js` so error delivery is confirmed.
