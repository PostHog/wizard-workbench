# PostHog setup report

PostHog server-side analytics was added to the anonymous Express todo API, with todo lifecycle events, centralized error tracking, graceful shutdown, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` `^5.46.1` with npm; `package.json` and `package-lock.json` were updated. The install completed successfully, adding the SDK and reporting 0 vulnerabilities.
- Created `posthog.js` with one shared `PostHog` client. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment and enables `enableExceptionAutocapture: true`.
- Added the configured environment values to `.env` using wizard tooling and documented the variable names in `.env.example`. Runtime deployment must inject these variables; this app does not load `.env` itself.
- Added SIGINT/SIGTERM shutdown handling in `index.js` so the server closes and awaits the shared client's `shutdown()`.

## Events instrumented

These captures are placed after successful mutations. The run verified the call sites and event contract, but did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A new todo was successfully created through the API. | `index.js` |
| `todo_updated` | An existing todo's title and/or completion state was successfully updated. | `index.js` |
| `todo_deleted` | An existing todo was successfully deleted through the API. | `index.js` |

The event properties contain only non-PII operational state: completion state and update-field booleans. No todo title is sent.

## Identity status

User identification was skipped. The API has no authentication, session, account, or user model, so no stable authenticated identifier was available. The captures are intentionally personless and do not fabricate an ID from a todo ID, title, email, or username. If authentication is added later, identify using the authenticated user's stable primary key through the documented request-context integration.

## Error tracking

`setupExpressErrorHandler(posthog, app)` was registered after the routes and before `app.listen` in `index.js`. The shared client also enables exception autocapture. The run verified the documented SDK/API shape, but did not run the application or observe an error arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918775) contains daily todo creation, update, and deletion insights plus a 14-day ordered todo lifecycle funnel. The dashboard and its four insights were created successfully, but they may be empty until events are generated.

## Verification and conflicts

- `npm install` completed successfully and reported 72 packages audited with 0 vulnerabilities.
- The review confirmed the package manifest, lockfile, singleton initialization, event contract, error handler, and graceful shutdown changes.
- No build, typecheck, or lint script is defined in `package.json` (only `start` and `dev` exist), so compile-time verification could not be run. This is the complete build conflict recorded by the run.
- No event delivery, application startup, test suite, or production build was verified.
- No CSP was present or changed.

## Before you merge

- [ ] Run a full production/build-equivalent verification and fix any errors introduced in `posthog.js` or `index.js`; this project currently has no build, typecheck, or lint script.
- [ ] Run the test suite (or add one if none exists) and update mocks or fixtures for the PostHog calls in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in each deployment environment, not only in local `.env`; inspect `posthog.js` and deployment configuration.
- [ ] Exercise successful POST, PATCH, and DELETE requests and confirm `todo_created`, `todo_updated`, and `todo_deleted` arrive in PostHog; inspect the capture call sites in `index.js`.
- [ ] Trigger an application error through the Express error path and confirm it appears in PostHog Error Tracking; inspect the `setupExpressErrorHandler` registration in `index.js`.
- [ ] If authentication is added later, wire a stable authenticated user identifier before relying on person-level attribution; inspect the request middleware and the capture/error paths in `index.js`.
