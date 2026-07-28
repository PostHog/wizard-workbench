# PostHog setup report

A server-side PostHog integration was added to the Koa notes API, with five lifecycle events, global error tracking, graceful SDK shutdown, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` at `^5.46.1` using npm; `package-lock.json` was created. The install and later `npm install` completed successfully with 0 vulnerabilities.
- Added the shared process-wide client in `posthog.js`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables, enables `enableExceptionAutocapture: true`, and is imported by `index.js`.
- Added `.env.example` documenting the two required environment variable names. The run verified both keys are present in the local `.env` through the environment checker; deployment configuration was not verified.
- Added graceful SIGINT/SIGTERM shutdown in `index.js`, awaiting the shared SDK's `shutdown()` after the Koa server closes.

## Events instrumented

The five events are captured after their corresponding in-memory mutation succeeds. The run verified the capture call sites and that the event plan matches them; it did **not** run the application or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `folder_created` | Successful creation of a notes folder | `index.js` |
| `folder_deleted` | Successful deletion of a non-default notes folder, including notes moved to General | `index.js` |
| `note_created` | Successful creation of a note, including folder and whether content exists | `index.js` |
| `note_updated` | Successful note update and which fields changed | `index.js` |
| `note_deleted` | Successful deletion of a note | `index.js` |

All five captures intentionally omit `distinctId`. They are therefore personless events, not attributable to stable users. No event was verified as captured during this run.

## User identification

Identification was skipped. The application has no authentication, login/session boundary, user model, or stable user identity. If authentication is added later, identify using the authenticated user's stable ID at that boundary; do not use note or folder IDs or PII.

## Error tracking

`index.js` registers one Koa `app.on('error')` handler. It forwards uncaught Koa errors through `captureException` with request method, request path, and response status context. SDK-level exception autocapture remains enabled in `posthog.js`. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918832)

The dashboard contains five tagged insights covering the note lifecycle funnel, folder activity, note creations by content, note updates, and note/folder deletions. Its insights use a rolling 30-day range and may be empty until events arrive.

## What the run verified, and what it did not

- Verified: dependency installation, environment-key presence in local `.env`, source-level initialization and capture wiring, event-plan alignment, graceful shutdown wiring, and dashboard creation with five tiles.
- Verified: `npm install` succeeds with 0 vulnerabilities.
- Not verified: a production build, typecheck, lint, test suite, application startup, request execution, event delivery, error delivery, or deployment environment configuration. `package.json` has only `start` and `dev` scripts, so no build, typecheck, or lint script was available.
- No build conflict was reported. Forced termination may still prevent queued events from flushing.

## Issues to follow up

1. **No stable attribution:** all five lifecycle events are personless because the API has no user identity. If left unresolved, dashboard trends cannot be reliably segmented or attributed to users. Add authentication first, then establish a stable PostHog distinct ID at the authentication boundary.
2. **Delivery remains unconfirmed:** no run step generated requests and checked PostHog for arrivals. If left unresolved, the integration could compile and still fail to send data.

## Before you merge

- [ ] Run a full production build; the wizard did not have a build script to run. Inspect the PostHog initialization in `posthog.js` and integration call sites in `index.js` if the build reports errors.
- [ ] Run the test suite; instrumented call sites in `index.js` may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`.
- [ ] Exercise the five successful mutation routes and confirm `folder_created`, `folder_deleted`, `note_created`, `note_updated`, and `note_deleted` arrive in PostHog; this was not observed by the wizard.
- [ ] If authentication is introduced, replace the current personless setup at the relevant request/auth boundary and verify stable identification for every event; current capture call sites are in `index.js` (approximately lines 29, 61, 101, 147, and 172).
