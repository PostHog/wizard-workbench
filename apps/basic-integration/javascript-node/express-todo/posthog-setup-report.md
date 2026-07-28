# PostHog setup report

PostHog server-side analytics was added to the anonymous Express todo API, including todo lifecycle instrumentation, centralized Express error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` 5.46.1 with npm; the lockfile was created or updated, and the audit reported 0 vulnerabilities.
- Added a shared singleton in `posthog.js`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables, fails loudly in non-production when configuration is missing, and remains a production no-op when unconfigured.
- The client is configured with `enableExceptionAutocapture: true`, `flushAt: 1`, and `flushInterval: 0`. Captures use an awaited flush before the short request handlers return.
- Added the variable names to `.env.example`; the real values were configured in `.env` through the wizard environment tooling. Secret values are intentionally not reproduced here.

## Events instrumented

These events were added at successful mutation completion points. The run verified that the call sites and event plan exist; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A new todo was successfully created through the API. | `index.js` |
| `todo_updated` | An existing todo was successfully updated through the API. | `index.js` |
| `todo_deleted` | An existing todo was successfully deleted through the API. | `index.js` |

Event properties are non-PII action state: completion status for creation/deletion and which update fields changed for updates. The events are deliberately personless because this API has no authentication, session, account model, or stable user identifier.

## User identification

Identification was skipped. The application has no user concept or stable authenticated identifier, and the identify step correctly made no edits rather than inventing an ID or using client-controlled data. Consequently, the run did not establish person-level attribution for these events or errors.

If authentication is added later, bind the authenticated stable user ID at the request boundary before relying on person-level attribution.

## Error tracking

A guarded global PostHog Express error handler was registered after the routes in `index.js`, using `setupExpressErrorHandler` from `posthog-node` and the shared client. Exception autocapture is enabled in the client configuration. The run verified the integration wiring but did not trigger an application error or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919697)

The dashboard contains four tagged insights: daily trends for each lifecycle event and an ordered todo lifecycle funnel. They use the exact event names above and the last 30 days. They were created intentionally even though the run did not verify that event data currently exists.

## Verification boundaries and unresolved issue

- `npm install` completed successfully, dependencies were current, and the audit reported 0 vulnerabilities.
- No build, typecheck, or lint command exists in `package.json`; therefore no build or static validation was run. A passing install/review is not evidence that events flow.
- No runtime API exercise was recorded, so event delivery, dashboard population, and error-event delivery remain unconfirmed.
- **Attribution unresolved:** every lifecycle event is personless because no stable identity exists. If left unresolved after authentication is introduced, user-level funnels, retention, and error attribution will remain fragmented or unavailable.
- No build conflict was reported.

## Before you merge

- [ ] Run a full production build or equivalent startup validation for this Express app and fix any SDK/API compatibility errors; the project exposes only `start` and `dev` scripts in `package.json` (no build script was available to the wizard).
- [ ] Run the test suite; instrumented call sites in `index.js` may require updated mocks or fixtures.
- [ ] Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment using the exact names documented in `.env.example`, not only in the local `.env`.
- [ ] Exercise successful create, update, and delete requests and confirm `todo_created`, `todo_updated`, and `todo_deleted` arrive in PostHog; inspect the capture helper and mutation call sites in `index.js`.
- [ ] Trigger an uncaught Express error and confirm it appears in PostHog Error Tracking; inspect the global error-handler registration after the routes in `index.js`.
- [ ] If authentication is introduced, add request-boundary identification using the stable authenticated ID before treating these events as person-attributed; currently identification is intentionally absent from `index.js`.
