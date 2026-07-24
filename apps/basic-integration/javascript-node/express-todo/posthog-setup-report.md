# PostHog setup report

A server-side PostHog integration was added to the Express todo API, covering todo lifecycle events, centralized Express error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) with npm and added it to `package.json` and `package-lock.json`.
- Installed `dotenv` and initialized it at the application entrypoint so local `.env` values are loaded before the PostHog singleton is imported.
- Added `posthog.js` as the shared server-side initialization point. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment, fails loudly in development when required configuration is missing, remains a production no-op without configuration, enables `enableExceptionAutocapture: true`, and flushes during SIGINT/SIGTERM shutdown.
- Documented the environment variable names in `.env.example`. The run recorded both configured keys as present in `.env`.

## Instrumented events

These captures were added after successful todo mutations. The run verified the call sites and event plan; it did **not** run the application or observe any events arriving in PostHog, so event delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A new todo is successfully created. | `index.js` |
| `todo_updated` | An existing todo's title is successfully updated. | `index.js` |
| `todo_completed` | An existing todo's completion status is changed. | `index.js` |
| `todo_deleted` | An existing todo is successfully deleted. | `index.js` |

Event properties are limited to the non-PII operational context `title_length` and `completed`. The captures intentionally have no stable user identity or session context.

## User identification

Identification was skipped. The API has no authentication, session, user model, login/signup/logout route, or incoming stable user identifier. No valid distinct ID could be established without inventing an application identity.

### Unresolved issue: event attribution

All four event call sites in `index.js` omit a stable distinct ID. This means events cannot currently be attributed to a real user. If authentication is introduced, bind the authenticated stable user primary key once per request using PostHog's Express request context or `withContext`; do not use todo IDs, titles, or an invented identifier. This remains unresolved because the current application exposes no identity source, and leaving it unresolved limits user-level analysis and attribution.

## Error tracking

A conditional global PostHog Express error handler was registered in `index.js` after the routes and before `app.listen`. The shared client also enables exception autocapture. This wires uncaught Express errors toward PostHog Error Tracking, but the run did not start the application or observe an exception arriving in PostHog.

## Dashboard

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1902516)

The dashboard contains four insights for the four instrumented event names, configured for the last 30 days. The dashboard and insight records were created successfully, but the dashboard may remain empty until events are sent; no event data was observed during this run.

## Verification and conflicts

- `npm install` completed successfully with zero vulnerabilities; the later `dotenv` addition also completed successfully with zero vulnerabilities.
- The review verified the changed integration files and found no unrelated changes.
- No tests were run.
- No build, lint, or typecheck script is defined in `package.json`, so no compile-time verification command was available. The attempted unscoped `npm run` command was rejected by the runtime. A passing build was therefore not established, and event flow was not established.

## Before you merge

- [ ] Run a full production build or equivalent application verification; no build script exists in `package.json`, and the wizard only reviewed the touched files.
- [ ] Run the test suite (if added or available) and update mocks or fixtures for the PostHog capture and error-handler paths in `index.js`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` in every deployment environment, not only locally; verify the loading path at `index.js:1` and initialization in `posthog.js`.
- [ ] Trigger each successful todo mutation and confirm `todo_created`, `todo_updated`, `todo_completed`, and `todo_deleted` arrive in PostHog; the capture call sites are in `index.js:30`, `index.js:56`, `index.js:65`, and `index.js:86`.
- [ ] Confirm an intentional authenticated identity strategy before relying on user-level attribution; the current capture call sites in `index.js:30`, `index.js:56`, `index.js:65`, and `index.js:86` have no stable distinct ID because the API has no user identity source.
- [ ] Trigger a controlled Express error and confirm it appears in PostHog Error Tracking; the conditional handler is registered at `index.js:95`.
