# PostHog setup report

A server-side PostHog integration was added to the Express todo API, including lifecycle event capture, centralized Express error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` and `dotenv`; the package manifest and lockfile were updated.
- `posthog.js` loads environment variables with `dotenv`, creates one shared PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables exception autocapture, and configures immediate flushing (`flushAt: 1`, `flushInterval: 0`).
- `.env.example` documents the required variable names. The configured local `.env` contains both keys, as verified by the run.
- Missing configuration fails loudly outside production and becomes a no-op in production, while route calls remain guarded.

## Instrumented events

| Event | Measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created. | `index.js` |
| `todo_updated` | An existing todo was successfully updated. | `index.js` |
| `todo_deleted` | An existing todo was successfully deleted. | `index.js` |

The route captures use non-PII operational properties and await `posthog.flush()` before returning. The run verified the capture code by static review; it did **not** run the application or observe events arriving in PostHog. Therefore, event delivery and dashboard population remain unconfirmed.

## User identification

Identification was skipped. The API has no authentication, sessions, user model, or stable user identifier. No fabricated or shared distinct ID was added, so events are currently personless. If authentication is added later, establish PostHog request context from the authenticated user's stable primary key before route handlers.

## Error tracking

`index.js` registers `setupExpressErrorHandler` from `posthog-node` after the routes, using the shared client when configured. This provides centralized uncaught Express error tracking. The run verified the registration by static review; it did not trigger an error and observe an error event in PostHog.

## Dashboard

The starter dashboard includes daily trends for the three lifecycle events and an ordered todo lifecycle funnel:

[Open Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914197)

The dashboard and four insight definitions were created successfully. Their data is unconfirmed until the application receives traffic.

## Build conflicts and verification limits

No build, typecheck, or lint script is defined in `package.json`. No production build, test suite, or application startup was run. Verification was limited to successful dependency installation, environment-key presence, and static review of the changed files. The complete conflict is therefore: the project provides only `start` and `dev` scripts, so build/typecheck/lint verification was unavailable.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment using the names documented in `.env.example`.
2. Run the API and exercise successful create, update, and delete requests.
3. Confirm `todo_created`, `todo_updated`, and `todo_deleted` arrive in PostHog and that the dashboard begins showing data.
4. Trigger a controlled Express error and confirm it appears in PostHog Error Tracking.
5. Add authentication and stable identity context before relying on person-level attribution.

## Before you merge

- [ ] Run a full production build (no build script is currently defined) and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite (no test script is currently defined); update mocks or fixtures for the instrumented call sites if tests are added.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in `.env.example` and configured in deployment environments, not only in the local `.env` (`posthog.js`, `.env.example`).
- [ ] Exercise the create, update, and delete handlers and confirm the three events arrive in PostHog (`index.js`, the capture handlers around lines 17–76).
- [ ] Trigger an Express error and confirm error tracking receives it (`index.js`, error-handler registration around lines 82–84).
