# PostHog setup report

A server-side PostHog integration was installed and initialized for the Hono links API, with link lifecycle events, global error tracking, and a starter dashboard configured.

## Verified by this run

### Installation and initialization

- Installed `posthog-node` (`^5.46.1`) with npm; `package-lock.json` was generated and the dependency resolved successfully.
- Added a singleton PostHog client in `posthog.js`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Enabled `enableExceptionAutocapture: true`.
- Configured `flushAt: 1` and `flushInterval: 0`, with awaited `flush()` calls at instrumented request boundaries.
- Added the environment variable names to `.env.example`; the run configured the real values in the local `.env` through wizard tooling.
- Missing configuration fails loudly outside production and becomes a production no-op, as required by the framework rules.

### Events instrumented

| Event | What it measures | File |
|---|---|---|
| `link_created` | A new saved link is successfully created; captures derived tag-count and description-presence metadata. | `index.js` |
| `link_updated` | An existing saved link is successfully updated; captures updated field names and derived favorite/tag-count metadata. | `index.js` |
| `link_deleted` | An existing saved link is successfully deleted; captures derived favorite and tag-count metadata. | `index.js` |

Captures occur only after the corresponding in-memory mutation succeeds. The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`. The run did **not** observe events arriving in PostHog, so ingestion and delivery remain unconfirmed.

### User identification

Identification was skipped. The API has no authentication, session, login, signup, logout, or user model from which to derive a stable non-PII identifier. Introducing one would risk misattribution. The product events are intentionally personless. If authentication is added later, bind a verified stable user ID once per request using the Node SDK context API; keep email and names as person properties rather than event properties.

### Error tracking

A single Hono `app.onError` handler was added in `index.js`. It calls `posthog.captureException(err)` and awaits `posthog.flush()` before returning a generic 500 response. The run reviewed the wiring but did not exercise a failing request or observe an error arrive in PostHog; Error Tracking delivery is therefore unconfirmed.

## Dashboard

Created and populated with four saved insights:

- Daily `link_created` trend
- Daily `link_updated` trend
- Daily `link_deleted` trend
- Ordered link lifecycle funnel: creation → update → deletion

Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918238) (dashboard ID `1918238`). The dashboard and insights were created successfully, but it may remain empty until events are ingested.

## Unresolved issues and build conflicts

- **Runtime delivery is unresolved:** the run did not start the application, send requests, or observe events/errors arriving in PostHog. If left unresolved, the dashboard and Error Tracking stream may not reflect real application activity.
- **No build, typecheck, or lint command exists:** `package.json` defines only `start` and `dev`, so those checks could not be run. Compilation and runtime compatibility are not proven by this run.
- **Dependency audit:** npm reported one moderate vulnerability in the dependency tree. It was not remediated and is unrelated to the PostHog changes.
- **Identity remains unresolved by design:** no stable user identity is available. If left unchanged, activity remains personless and cannot be reliably attributed to authenticated users until an auth model exists.

## Next steps

1. Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; keep the names aligned with `.env.example`.
2. Start the API and exercise successful create, update, and delete requests; confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog.
3. Exercise an uncaught error and confirm it appears in PostHog Error Tracking.
4. Review and address the moderate npm audit finding according to the project's dependency policy.
5. If authentication is introduced, add stable-ID binding at the request boundary and verify returning users do not fragment across anonymous identities.

## Before you merge

- [ ] Run a full production build; no build script exists currently, so add or run the project's equivalent and fix any errors introduced by the integration (`package.json`, scripts section).
- [ ] Run the test suite; no test script is defined currently, and instrumented call sites may need mocks or fixtures (`package.json`, scripts section; route handlers in `index.js`).
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in each deployment environment, not just locally (`.env.example`, `posthog.js`).
- [ ] Trigger successful create, update, and delete requests and verify the three event names in PostHog (`index.js`, POST/PATCH/DELETE `/api/links` handlers).
- [ ] Trigger an uncaught application error and verify Error Tracking delivery (`index.js`, `app.onError` handler).
