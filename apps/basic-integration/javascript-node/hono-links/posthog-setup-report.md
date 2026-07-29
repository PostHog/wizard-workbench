# PostHog setup report

PostHog server-side analytics was installed and initialized for the Hono links API, with mutation events, uncaught-error reporting, and a starter dashboard configured.

## What was installed and initialized

- Installed `posthog-node` with npm and added it to `package.json` and `package-lock.json`.
- Installed `dotenv` so local `.env` configuration is loaded at startup.
- `posthog.js` is the sole shared PostHog client initialization point. It reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from `process.env`, enables `enableExceptionAutocapture: true`, and uses `flushAt: 1` and `flushInterval: 0` for immediate delivery in this short-lived request setup.
- Missing configuration fails loudly outside production and leaves production unconfigured deployments as a no-op. The configured `.env` contains both required keys, and `.env.example` documents their names.
- Each instrumented request awaits `posthog.flush()` before responding.

## Events instrumented

These events are implemented in `index.js`; the run did not execute the API against PostHog, so arrival of any event is **unconfirmed**.

| Event name | What it measures | File |
|---|---|---|
| `link_created` | A new saved link is successfully created, including tag count and whether it has a description. | `index.js` |
| `link_updated` | An existing saved link is successfully updated, including changed fields, favorite state, and tag count. | `index.js` |
| `link_deleted` | A saved link is successfully deleted, including prior favorite state and tag count. | `index.js` |

The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`. Read-only routes were intentionally not instrumented.

## User identification

Identification was skipped. The API has no authentication, session, account, or stable user model. The three action events are intentionally personless; no fabricated distinct ID was added. If authentication is introduced later, bind the authenticated stable user primary key at the request boundary and do not use email or username as the distinct ID.

## Error tracking

`index.js` registers one global Hono `app.onError` handler. It calls `posthog.captureException(err, distinctId)` and awaits `posthog.flush()`, optionally associating the error using the `x-posthog-distinct-id` request header, then returns a generic HTTP 500 response. Error arrival in PostHog was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924602)

The dashboard contains four insights: daily link creations, updates broken down by `is_favorite`, daily link deletions, and an ordered link lifecycle funnel using `link_created`, `link_updated`, and `link_deleted`. The dashboard and insights were created successfully, but may remain empty until events arrive; no event flow was verified.

## What the run verified vs. did not verify

**Verified:** npm installed the declared dependencies; the PostHog singleton and route/error instrumentation were written and reviewed; the configured environment keys are present; the dashboard and four insights were created successfully.

**Not verified:** no build, typecheck, or lint command exists in `package.json`; the test suite was not run; the application was not started; no requests were sent; no custom event or exception was observed arriving in PostHog.

## Unresolved issues and impact

- Stable user attribution could not be established because the application has no identity model. Events cannot be analyzed by authenticated user until a stable user ID is available and bound at the request boundary.
- Event delivery was not exercised. Until a real mutation request is made and the events are checked in PostHog, the dashboard and funnel remain unvalidated and may be empty.

## Build conflict

No build, typecheck, or lint scripts are defined in `package.json`, so a full production build and static checks could not be run. npm also reported one unrelated moderate dependency audit vulnerability; it was not changed because remediation would be unrelated dependency work.

## Before you merge

- [ ] Run a full production build (no build script is currently defined in `package.json`) and fix any errors introduced by the integration; inspect the PostHog initialization in `posthog.js` and instrumentation in `index.js`.
- [ ] Run the test suite (no test script is currently defined in `package.json`) and update mocks or fixtures for the awaited PostHog calls in `index.js` if needed.
- [ ] Confirm `POSTHOG_API_KEY` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; check `posthog.js` and the deployment/bootstrap configuration.
- [ ] Exercise successful create, update, and delete requests, then confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog and populate the dashboard.
- [ ] If authentication is added, bind a stable user primary key before the captures in `index.js`; do not use request-controlled email or username values for attribution.
