# PostHog setup report

PostHog server-side analytics was installed and initialized for the Fastify blog API, with four anonymous mutation events, centralized error capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) using npm; `package-lock.json` was created/updated. The install completed with 0 vulnerabilities.
- Added the shared singleton in `posthog.js`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment and enabling `enableExceptionAutocapture: true`.
- Added `.env.example` documenting both required variable names. Local `.env` contains configured values, and startup scripts in `package.json` load it when present. Production remains a no-op when configuration is absent; development reports the missing-variable error.
- The run did not observe events arriving in PostHog. The event list below describes implemented instrumentation and the planned dashboard queries, not confirmed delivery.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `post_created` | A blog post is successfully created | `index.js` |
| `post_updated` | A blog post is successfully updated | `index.js` |
| `post_deleted` | A blog post and its associated comments are successfully deleted | `index.js` |
| `comment_created` | A comment is successfully added to a blog post | `index.js` |

Captures are personless and contain operational metadata only. The app has no authentication or stable user record, so the user-entered `author` field was not used as identity or event data.

## User identification

Identification was skipped. The API has no authentication, session, login, registration, or verified stable account identifier. Events and errors therefore remain anonymous until a future authentication layer can provide a stable user ID.

## Error tracking

`index.js` registers Fastify's global `setErrorHandler`. It calls `posthog?.captureException(error)` before delegating to Fastify's normal response handling. The PostHog client also has exception autocapture enabled. The run did not trigger an application error and did not observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924594)

The dashboard contains four tagged trends insights for the four event names, using daily aggregation over the last 30 days. Its existence was verified by the PostHog MCP; population with newly generated application events was not verified.

## Verification and unresolved issues

- Dependency installation completed successfully, and the review found no dependency vulnerabilities.
- The project has no build, typecheck, or lint scripts, so those checks were unavailable. Tests were not run. No application startup or end-to-end event delivery was observed.
- No build conflict was reported beyond the unavailable checks: `package.json` defines only `start` and `dev`, with no build, typecheck, or lint script.
- No stable identity was available. This means dashboards cannot attribute these events to authenticated users; adding auth later requires request-scoped identification using a verified stable user ID, not `author`.
- No `DISTINCT_ID` placeholder was introduced at any call site.

## Before you merge

- [ ] Run the full production build (no build script was available to the wizard) and fix any compilation errors introduced by the integration; inspect `package.json`, `posthog.js`, and `index.js`.
- [ ] Run the test suite; no tests were run by the wizard, and instrumented handlers in `index.js` may require updated mocks or fixtures.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; keep the exact names documented in `.env.example` and inspect `package.json` startup configuration.
- [ ] Start the API, exercise successful create/update/delete/comment routes in `index.js`, and confirm the four events arrive in PostHog and populate the dashboard.
- [ ] If authentication is added, wire request-scoped identification with a verified stable user ID before relying on user attribution; do not use the `author` field in `index.js`.
