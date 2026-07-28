# PostHog setup report

A server-side PostHog integration was added to the Express todo API, with three todo lifecycle events, centralized error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) for server-side Node.js analytics. The install completed successfully with 0 vulnerabilities.
- Added `dotenv` (`^17.4.2`) so local `.env` settings are loaded during startup.
- Added the shared PostHog client in `posthog.js`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables and enables `enableExceptionAutocapture: true`.
- Added `.env.example` documenting both variable names. The run verified that both variables are present in the local `.env` through wizard tooling; deployment configuration was not verified.
- In production, missing configuration is a no-op; in non-production, each missing variable produces the required configuration error.
- Added graceful SIGINT/SIGTERM shutdown in `index.js`, awaiting the shared client's shutdown after the server closes so queued events can be delivered.

## Events instrumented

| Event | Measures | File |
|---|---|---|
| `todo_created` | A new todo was successfully created through the API; includes the resulting completion state. | `index.js` |
| `todo_updated` | An existing todo was successfully updated through the API; includes which mutable fields changed and the resulting completion state. | `index.js` |
| `todo_deleted` | An existing todo was successfully deleted through the API. | `index.js` |

Captures occur after successful mutations. Todo titles are intentionally excluded because they are user-entered content. The run verified the capture call sites and event plan, but did **not** observe events arriving in PostHog; dashboard insights may therefore initially be empty.

## Identification

User identification was skipped. The API has no authentication, login, session, user model, or stable user identifier, so the events are intentionally personless rather than attributed to a fabricated ID. If authentication is added later, bind a stable authenticated user ID at the request boundary; do not use an email or username as the event identity.

## Error tracking

`index.js` registers `posthog-node`'s `setupExpressErrorHandler(posthog, app)` after the routes, when the shared client is configured. The shared client also enables exception autocapture. The run verified the integration was added, but did not run the server or trigger an exception, so delivery to PostHog Error Tracking remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918198)

The dashboard contains three daily trend insights for `todo_created`, `todo_updated`, and `todo_deleted`. The dashboard and its tiles were successfully created in PostHog; incoming event data was not observed during this run.

## Verification and unresolved issues

- `npm install` completed successfully; dependencies were up to date and the audit reported 0 vulnerabilities.
- The review found no build, typecheck, or lint scripts in `package.json`. No build, typecheck, or lint verification was available.
- The harness rejected `npm run start` because it is not an allowed verification script. As a result, application boot, runtime SDK compatibility, event delivery, and error delivery were not verified.
- No stable identity was available. This costs person-level attribution and user-level funnels until an authenticated identifier is introduced; the current personless events are still usable for aggregate API action counts.

## Next steps

1. Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, using `.env.example` as the naming reference; do not commit the real `.env` values.
2. Start the API in a normal local environment and exercise successful create, update, and delete requests. Confirm the three events appear in PostHog and that the dashboard begins populating.
3. Trigger a controlled Express error and confirm it appears in PostHog Error Tracking.
4. Add a stable authenticated user boundary if the API gains authentication, then bind that ID before these captures.
5. Run the project's production build and test suite when available; this run could not perform those checks because no build/test verification scripts were defined or permitted.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced in `posthog.js` or `index.js` (no build, lint, or typecheck scripts exist in `package.json`, so this remains unverified).
- [ ] Run the test suite, including any mocks or fixtures covering the instrumented call sites in `index.js` (no test script was available during this run).
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in each deployment environment, not only in the local `.env`.
- [ ] Start the API and verify `todo_created`, `todo_updated`, and `todo_deleted` arrive in PostHog; the run only verified source call sites, not event flow.
- [ ] Trigger an application error and verify the centralized handler in `index.js` creates an Error Tracking issue; runtime delivery was not observed in this run.
