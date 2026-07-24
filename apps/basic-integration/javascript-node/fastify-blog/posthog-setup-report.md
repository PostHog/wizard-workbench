# PostHog setup report

PostHog server-side analytics was installed and initialized for the Fastify blog API, with four personless mutation events, centralized exception capture, and a starter dashboard.

## Verified setup

- **SDK installed:** `posthog-node` `^5.46.1` was added to `package.json`; `package-lock.json` was created/updated. `npm install` completed successfully, with 53 packages audited and 0 vulnerabilities.
- **Initialization:** `posthog.js` creates one process-wide `PostHog` client from the runtime environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. It enables exception autocapture and immediate flushing (`flushAt: 1`, `flushInterval: 0`). Missing configuration fails loudly in development/debug startup and becomes a production no-op.
- **Environment documentation:** `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; real values were written to `.env` through the wizard environment tool. Deployment environments still need their own configuration.
- **Identity:** User identification was **skipped**. The API has no authentication, sessions, user records, or verified stable user identifier. The request-supplied `author` field is untrusted content and was not used as identity. Events and exceptions use PostHog's reserved `$POSTHOG_PERSONLESS` identity instead.

## Events instrumented

All four events are captured only after the corresponding successful mutation, with awaited flushes. No author, title, body, or comment text is sent as event properties.

| Event | What it measures | File |
|---|---|---|
| `post_created` | A blog post was successfully created, including its numeric ID and initial publication state | `index.js` |
| `post_updated` | A blog post was successfully updated, including its numeric ID, resulting publication state, and updated field names | `index.js` |
| `post_deleted` | A blog post was successfully deleted, including its numeric ID and number of associated comments removed | `index.js` |
| `comment_created` | A comment was successfully created, including its numeric comment and post IDs | `index.js` |

The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`.

## Error tracking

A global Fastify `setErrorHandler` was added in `index.js`. It calls `posthog.captureException(error, '$POSTHOG_PERSONLESS')`, awaits `posthog.flush()`, logs the error, and returns an appropriate HTTP error response. Exception arrival in PostHog was **not observed during this run**; the code path was reviewed but not exercised against a running application.

## Dashboard

The dashboard **Analytics basics (wizard)** exists with four daily trend insights covering the last 30 days:

[Open the PostHog dashboard](https://us.posthog.com/project/483112/dashboard/1902591)

The dashboard and insights were created successfully, but they may show no data until the application emits events. This run did not observe event delivery in PostHog, so captured volume is unconfirmed.

## What was not verified

- No application build, typecheck, lint, or test command was run. `package.json` defines only `start` and `dev`; no build-quality scripts exist.
- No server start or route exercise was performed.
- No event or exception was observed arriving in PostHog.
- No authenticated identity could be established because the application has no auth model.

## Build conflict

No build, typecheck, or lint scripts are defined, so compilation-quality verification was limited to dependency installation and static review. An attempted bare `npm run` was rejected by execution policy because no named verification script was provided. No dependency conflict or installation vulnerability was reported.

## Unresolved issues to follow up

1. **Event delivery remains unconfirmed.** The integration defines and flushes the events, but the run did not start the server or observe arrival in PostHog. If left unresolved, the dashboard can remain empty even when the code appears correct.
2. **Events are intentionally personless.** No stable authenticated user ID exists. If authentication is added later and this is not revisited, user-level attribution and identity-based analysis will remain unavailable.
3. **Runtime configuration must be supplied outside local development.** If `POSTHOG_PROJECT_TOKEN` or `POSTHOG_HOST` is absent in production, the client becomes a no-op and events will be missed.

## Before you merge

- [ ] Run a full production build or equivalent named verification command and fix any errors introduced in `index.js` or `posthog.js`; no build script currently exists in `package.json`.
- [ ] Run the test suite, or add/run route tests for the mutation handlers in `index.js` (event call sites are around lines 47–58, 92–106, 132–145, and 175–185) and update mocks or fixtures as needed.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only `.env` (see `posthog.js` lines 3–4).
- [ ] Start the application and exercise successful create, update, delete, and comment routes in `index.js`; confirm `post_created`, `post_updated`, `post_deleted`, and `comment_created` arrive in PostHog and populate the dashboard.
- [ ] Exercise an uncaught application error and confirm the centralized handler in `index.js` lines 5–13 produces the expected Error Tracking event.
