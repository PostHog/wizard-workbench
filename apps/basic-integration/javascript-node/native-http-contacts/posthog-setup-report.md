# PostHog setup report

PostHog server-side analytics was added to the native Node.js contacts API, with four mutation events, exception tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) and `dotenv` (`^17.4.2`); both are declared in `package.json` and resolved in `package-lock.json`.
- Added `posthog.js`, which creates a shared PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables exception autocapture, uses immediate batching, and registers graceful shutdown handling.
- Added dotenv loading so local `.env` configuration is available when the server starts. The environment variable names are documented in `.env.example`; the run confirmed both keys are present in the local `.env`.
- Imported the shared client into `index.js`. Captures are guarded for unavailable production configuration and flushed before short-lived request completion.

## Events instrumented

These events are planned and instrumented in `index.js`. The run did not start the server or observe any event arriving in PostHog, so none should be treated as verified captured data yet.

| Event | What it measures | File |
|---|---|---|
| `contact_group_created` | A contact group is successfully created. | `index.js` |
| `contact_created` | A contact record is successfully created. | `index.js` |
| `contact_updated` | An existing contact record is successfully updated. | `index.js` |
| `contact_deleted` | A contact record is successfully deleted. | `index.js` |

Event properties contain resource/group identifiers and changed field names, not contact PII. Reads and validation failures were not given custom events.

## Identification

User identification was skipped. The API has no authentication, session, login, signup, or application-user concept. Contact IDs represent managed resources rather than the actor making a request, so using them as distinct IDs would misattribute analytics. Route and exception telemetry therefore remains anonymous/personless. If authentication is added later, bind a stable authenticated user ID to request-scoped PostHog context; do not use contact IDs or client-provided headers as actor identity.

## Error tracking

The centralized HTTP server error handler in `index.js` calls `posthog.captureException(err)` and awaits `posthog.flush()` before returning the 500 response. Exception autocapture is also enabled in the PostHog client. The run verified the implementation by review, but did not trigger an error and did not observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919751)

The dashboard contains four daily trend insight tiles for the four event names above over the last 30 days. The dashboard and insight definitions were created successfully; fresh events may not yet have been ingested.

## Verification status and unresolved issues

- Dependency installation completed successfully with zero reported vulnerabilities.
- Review verified the configured SDK initialization, event names, post-write capture locations, awaited flushes, PII-free event properties, and centralized exception capture.
- No build, typecheck, or lint script is defined. No supported project verification command beyond dependency installation was available, and no runtime request was executed.
- The run did not verify that events flow to PostHog. This costs the team runtime confirmation that the configured deployment can send telemetry and that the dashboard receives data.
- Attribution remains unresolved by design: without authenticated actors, analytics cannot distinguish which user performed a mutation. This costs user-level analysis until an authentication boundary supplies a stable actor ID.

## Before you merge

- [ ] Run the application and exercise each successful mutation route, then confirm `contact_group_created`, `contact_created`, `contact_updated`, and `contact_deleted` arrive in PostHog and populate the dashboard; inspect the capture call sites in `index.js` (lines 52, 102, 133, and 156).
- [ ] Trigger the centralized 500 error path and confirm the exception appears in PostHog; inspect `index.js:169`.
- [ ] Run the full production/build verification available in the deployment environment; this project defines only `start` and `dev` scripts in `package.json`, so also fix any lint or type errors introduced by the integration.
- [ ] Run the test suite, if one is added or available in the deployment environment, and update mocks or fixtures for the PostHog client and capture calls.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, using the exact names documented in `.env.example`, rather than relying only on the local `.env`.
- [ ] If authentication is introduced, replace anonymous request attribution with the authenticated stable user ID at that boundary; review `index.js` capture/error call sites before enabling user-level analysis.
