# PostHog setup report

PostHog server-side analytics was initialized for the Koa notes API, with five lifecycle events instrumented, centralized exception capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` with npm; it is declared in `package.json` and resolved in `package-lock.json`.
- Installed `dotenv` and added `import 'dotenv/config'` so the local `.env` configuration is loaded at startup.
- `posthog.js` creates the sole PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, enables `enableExceptionAutocapture: true`, and exports the singleton as `posthog`.
- In non-production, missing configuration raises the required actionable error; in production, missing configuration leaves the integration as a no-op.
- The real environment keys were configured in `.env` during the run, and `.env.example` documents the variable names.

The run verified dependency installation, configuration-file presence, source read-back, and dashboard creation. It did **not** observe events arriving in PostHog, and therefore does not claim that any event was captured or delivered.

## Events instrumented

All five events are emitted from `index.js` after the corresponding successful mutation. Their properties are operational metadata only; no user-entered PII is included.

| Event name | What it measures | File |
|---|---|---|
| `folder_created` | A folder was successfully created. | `index.js` |
| `folder_deleted` | A non-default folder was successfully deleted. | `index.js` |
| `note_created` | A note was successfully created. | `index.js` |
| `note_updated` | An existing note was successfully updated. | `index.js` |
| `note_deleted` | An existing note was successfully deleted. | `index.js` |

The event plan identifies these five contracts. The run did not execute the API against a live PostHog ingestion endpoint, so delivery remains unconfirmed.

## User identification

User identification was skipped. The API has no authentication flow, session, user record, or trusted incoming user identifier. No placeholder distinct ID was introduced, so the events are intentionally personless. Until authentication supplies a stable user ID, the events cannot be attributed to users.

## Error tracking

`index.js` registers one guarded `app.on('error')` handler that calls `posthog.captureException(error)` through the singleton. The initialization also enables PostHog exception autocapture. The run verified this wiring by source review; it did not trigger an exception and observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919752)

The dashboard was created with four tagged live insight definitions: folder creation/deletion trends, note lifecycle activity, folder creation by `folder_id`, and a folder-to-note ordered funnel. The dashboard exists and its tiles were attached successfully; its data population was not verified during this run.

## Build and validation status

- `npm install` completed successfully; the review reported 84 audited packages and zero vulnerabilities.
- `npm run build` was attempted, but the project has no `build` script. It failed with `Missing script: "build"`.
- No build, typecheck, lint, test, or application-start validation was completed. Consequently, compilation, runtime startup, and event flow are unconfirmed.

## Open issue to resolve

- **User attribution is unresolved:** `index.js` has no authentication or trusted user identity source, so all five lifecycle events and exception data remain unattributed to users. If left unresolved, user-level funnels, retention, and per-user debugging cannot be interpreted. Add an authentication-backed stable ID and bind it at request/context scope before relying on user attribution.

## Next steps

1. Configure `POSTHOG_API_KEY` and `POSTHOG_HOST` in every deployment environment using the exact names documented in `.env.example`; do not rely only on the local `.env`.
2. Add or connect a trusted authentication identity before adding `identify` behavior or interpreting events by user.
3. Run the API's mutation routes in a configured environment and confirm the five event names arrive in PostHog; also trigger an application error and confirm Error Tracking receives it.
4. Review the dashboard after traffic arrives and validate that its trends, breakdown, and funnel match the intended folder and note lifecycle behavior.

## Before you merge

- [ ] Run a full production build and fix any build, lint, or type errors introduced by the integration; this project currently has no build, lint, or typecheck script, and `npm run build` reports `Missing script: "build"`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites; no test script was available during this run.
- [ ] Confirm `POSTHOG_API_KEY` and `POSTHOG_HOST` from `.env.example` are configured in deployment environments, not only in the local `.env`.
- [ ] Exercise the folder and note mutation routes and verify `folder_created`, `folder_deleted`, `note_created`, `note_updated`, and `note_deleted` arrive in PostHog; delivery was not observed during the wizard run.
- [ ] Trigger a representative Koa application error and verify it appears in PostHog Error Tracking; this was not observed during the wizard run.
