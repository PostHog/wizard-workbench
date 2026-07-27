# PostHog setup report

PostHog server-side analytics was added to the Koa notes API, covering five successful CRUD actions, centralized exception capture, graceful shutdown flushing, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` `^5.46.1` with npm; `dotenv` was also added so runtime environment configuration is loaded. The install completed successfully, audited 84 packages, and reported 0 vulnerabilities.
- `posthog.js` creates the shared PostHog singleton from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with `enableExceptionAutocapture: true`. Missing configuration fails loudly outside production and becomes a production no-op, as required by the integration rules.
- The real development values were configured through the environment tooling; `.env.example` documents the required variable names. Production deployments must provide those variables through their environment.
- Route captures are personless and set `$process_person_profile: false`; no user identity was fabricated.

## Instrumented events

These are the events planned and instrumented in `index.js`. The run verified their capture call placement after successful mutations; it did **not** run the application or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `folder_created` | A folder is successfully created in the notes API. | `index.js` |
| `folder_deleted` | A non-default folder is successfully deleted, including notes moved to General. | `index.js` |
| `note_created` | A note is successfully created, including content length and whether it uses the default folder. | `index.js` |
| `note_updated` | An existing note is successfully updated, including which fields changed without capturing note content. | `index.js` |
| `note_deleted` | An existing note is successfully deleted. | `index.js` |

## User identification

Identification was skipped. The API has no authentication, sessions, user records, or stable user identifier, and the run found no safe identity source. Events are intentionally anonymous. If authentication is added later, bind a stable authenticated user ID once per request; never use note data or user-entered values as a distinct ID.

## Error tracking

`index.js` registers one Koa `app.on('error')` handler. It calls `posthog.captureException` with request method, path, and response status metadata, then flushes the shared client. The singleton also enables exception autocapture. The run verified the handler was added, but did not trigger an exception or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914233)

The dashboard was created successfully with five tagged insights: folder activity, note activity, note creation by folder choice, folder-to-note workflow, and note lifecycle. The insights may initially be empty because event delivery was not observed during this run.

## What was not verified

- No production build, typecheck, or lint command exists in `package.json`, so none was run.
- The harness disallowed starting the application, so runtime boot and event delivery were not verified.
- No test script exists, so the instrumented routes and error path were not exercised by an automated suite.

## Issues to follow up

- **Runtime/build validation remains unresolved:** the review could not run a build or boot the server because no build/typecheck/lint scripts are defined and start-script execution was disallowed. If left unresolved, syntax or startup issues could remain undiscovered even though the edited files were reviewed.
- **Event delivery remains unconfirmed:** no request was exercised and no event was observed in PostHog. If left unresolved, the dashboard can remain empty despite the capture calls being present.
- **Identity attribution is unresolved by design:** there is no stable user identity in the current API. If left unchanged, events cannot be attributed to individual users; adding an invented ID would make attribution misleading.

## Before you merge

- [ ] Run a full production build (or add an appropriate build/check command) and fix any lint or type errors introduced in `posthog.js` or `index.js`.
- [ ] Run the test suite, or manually exercise the successful CRUD routes and error path in `index.js` to verify their PostHog behavior.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only locally; review `posthog.js` lines 1–25 and the deployment configuration.
- [ ] Exercise each successful mutation in `index.js` lines 47, 80, 130, 179, and 202, then confirm the five events arrive in PostHog and populate the dashboard.
- [ ] Trigger an application error through the Koa error boundary in `index.js` lines 11–18 and confirm the exception appears in PostHog Error Tracking.
- [ ] If authentication is introduced, wire the stable authenticated ID at the request boundary before relying on user-level attribution; review the identity handling around the routes in `index.js`.
