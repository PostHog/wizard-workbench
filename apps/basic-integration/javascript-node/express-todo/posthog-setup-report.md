# PostHog setup report

PostHog server-side analytics was added to the Express todo API, with three todo action events, centralized Express error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` and `dotenv` using npm; the resolved dependencies are recorded in `package.json` and `package-lock.json`.
- Added the shared singleton in `posthog.js`. It loads `.env` with `dotenv`, reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment, fails loudly in development when configuration is missing, and remains a production no-op when unconfigured.
- The singleton enables `enableExceptionAutocapture: true`. No second PostHog client was created.
- The configured environment keys were confirmed present without exposing their values.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `todo_created` | A todo was successfully created through the API. | `index.js` |
| `todo_updated` | A todo's title or completion state was successfully updated through the API. | `index.js` |
| `todo_deleted` | A todo was successfully deleted through the API. | `index.js` |

Each event is captured after its corresponding in-memory mutation succeeds. Properties are non-PII todo context: `todo_id`; updates also include `updated_fields` and `completed`.

**Important:** The run verified the capture calls and event plan in source; it did not run the server or observe events arriving in PostHog. Event delivery is therefore unconfirmed.

## User identification

Identification was skipped. The API has no authentication, session, account, or user model from which to obtain a stable distinct ID. Events are intentionally personless; no fabricated ID was added. If authentication is introduced later, bind the authenticated stable user ID at request scope through the shared client, keeping email and name as person properties rather than event properties.

## Error tracking

`index.js` imports `setupExpressErrorHandler` from `posthog-node` and registers it after the routes, using the shared client. The run verified the handler registration in source, but did not start the application or observe an exception arriving in PostHog. The installed SDK export was assumed from the project reference and dependency context.

## Dashboard

A dashboard named **Analytics basics (wizard)** was created with four tiles: daily trends for each of the three events and an ordered 14-day lifecycle funnel across all three. PostHog returned dashboard ID `1924591` and insight IDs `10566301`, `10566300`, `10566303`, and `10566302`. The dashboard may initially be empty because event arrival was not verified.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1924591)

## Build conflicts and verification limits

No build conflict was reported. Dependencies installed successfully and the review reported 73 packages audited with 0 vulnerabilities. This project has no build, typecheck, or lint scripts—only `start` and `dev`—so no build, typecheck, lint, test suite, or runtime request exercise was performed. A passing dependency installation does not prove that events flow.

## Before you merge

- [ ] Run the application and exercise create, update, and delete routes; then confirm `todo_created`, `todo_updated`, and `todo_deleted` arrive in PostHog.
- [ ] Run the test suite (or add one if absent) and update mocks or fixtures for the new PostHog import and capture calls.
- [ ] Run a production-style startup/build check for the deployment environment; inspect `index.js` and `posthog.js` for any integration errors introduced by the instrumentation.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only locally; the exact names are documented in `.env.example` and consumed by `posthog.js`.
- [ ] Confirm the deployed process can load its `.env` or equivalent environment configuration before `posthog.js` initializes.
- [ ] If authentication is added later, establish a stable user ID and wire request-scoped identification before relying on person-level attribution.
