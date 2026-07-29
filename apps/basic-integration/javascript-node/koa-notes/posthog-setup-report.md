# PostHog setup report

PostHog server-side analytics is initialized for the Koa notes API, with five CRUD events planned and instrumented, global Koa error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` `^5.46.1` and `dotenv` `^17.4.2`; `npm install` completed with 0 vulnerabilities. The dependency and lockfile changes are in `package.json` and `package-lock.json`.
- `posthog.js` creates the single shared `posthog-node` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- The client enables `enableExceptionAutocapture: true`.
- Missing configuration fails loudly outside production and remains a production no-op when configuration is absent.
- `index.js` imports `dotenv/config` first so local `.env` values load before the shared client is evaluated. `.env.example` documents both variable names.
- No event delivery was observed during this run. The review verified source changes and dependency installation only; it did not run the application, tests, or a build.

## Events instrumented

These events are emitted after their corresponding successful state changes in `index.js`. They are personless because no stable authenticated identity exists in this application.

| Event | What it measures | File |
|---|---|---|
| `folder_created` | A folder was successfully created. | `index.js` |
| `folder_deleted` | A non-default folder was successfully deleted and its notes moved to General. | `index.js` |
| `note_created` | A note was successfully created. | `index.js` |
| `note_updated` | An existing note was successfully updated. | `index.js` |
| `note_deleted` | An existing note was successfully deleted. | `index.js` |

The event contract is recorded in `.posthog-wizard-cache/.posthog-events.json`. The run did not verify that any of these events arrived in PostHog.

## User identification

Identification was skipped. The API has no authentication, session, account, or user model from which to obtain a stable user identifier. The implementation intentionally does not invent IDs from folder or note identifiers. If authentication is added, establish PostHog identity at that boundary using the authenticated primary key and person properties.

### Unresolved issue: attribution

All five CRUD events currently lack a stable distinct ID because the application has no identity surface. Until authentication or another legitimate stable identity is introduced, events cannot be attributed to users or analyzed by user-level journeys; adding an identifier derived from note or folder data would be incorrect.

## Error tracking

`index.js` registers a Koa application-level `error` listener. It calls `posthog.captureException(error)` and flushes the queued event when the shared client exists. The shared client also has exception autocapture enabled. The run verified the wiring by review only; no runtime exception was generated and no error event was observed arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924601)

The dashboard contains five insights based on the instrumented events: folder creation trend, note activity trend, folder deletion impact, note lifecycle funnel, and folder-to-note workflow funnel. The insights use the last 30 days and may be empty until events arrive.

## Build and verification status

- `npm install` completed successfully with 0 vulnerabilities.
- No build, typecheck, or lint scripts are defined in `package.json`; the manifest provides only `start` and `dev`. Therefore, no build, typecheck, or lint verification was available in this run.
- Tests were not run. No runtime event delivery or exception delivery was observed.
- No build conflict was encountered beyond the verification limitation above: the project has no build, typecheck, or lint scripts, so those checks could not be executed.

## Before you merge

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the integration; `package.json` currently defines no build, lint, or typecheck scripts.
- [ ] Run the test suite and update mocks or fixtures if needed; no tests were run in this setup (`index.js`, especially the instrumented CRUD handlers).
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only the local `.env`; inspect `posthog.js` and the deployment/bootstrap configuration.
- [ ] Exercise the five successful CRUD paths and confirm the corresponding events arrive in PostHog; inspect the capture call sites in `index.js` and the dashboard above.
- [ ] Decide how the application will establish a stable authenticated identity before relying on user-level attribution; inspect the personless captures in `index.js` and add identity only at a real authentication boundary.
- [ ] Trigger an uncaught Koa error in a safe environment and confirm it appears in PostHog Error Tracking; inspect the `app.on('error')` handler in `index.js`.
