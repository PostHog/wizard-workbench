# PostHog setup report

PostHog was initialized for the Fastify blog API with four server-side action events, global exception capture, and a starter analytics dashboard.

## What was installed and initialized

- Installed `posthog-node` and `dotenv`; the install completed with 0 vulnerabilities.
- Added the shared initialization module in `posthog.js`. It loads environment variables with `dotenv/config`, reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enableExceptionAutocapture`, and configures immediate flushing (`flushAt: 1`, `flushInterval: 0`).
- Added the environment variable names to `.env.example`; real local values were configured in `.env` during the run. Secrets are not reproduced here.
- Added graceful shutdown handling in `index.js` so the shared client calls `shutdown()` when Fastify closes.

## Events instrumented

These events are instrumented at successful in-memory mutation points. The run did not start the server or observe events arriving in PostHog, so delivery and event counts remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `post_created` | A new blog post was successfully created | `index.js` |
| `post_updated` | An existing blog post was successfully updated | `index.js` |
| `post_deleted` | A blog post and its associated comments were successfully deleted | `index.js` |
| `comment_created` | A new comment was successfully added to a blog post | `index.js` |

The event properties use non-PII mutation metadata such as post/comment IDs, publication state, updated-field booleans, and deleted-comment count. Captures use the Fastify request ID and disable person-profile processing.

## Identification

User identification was skipped. The application has no authentication, session, login, registration, user model, or verified account identifier. The `author` fields are user-entered content and were correctly not used as PostHog identities or event properties. If authentication is added later, identify users at the request boundary with a stable account primary key, keeping email/name only in person properties.

## Error tracking

A global Fastify `setErrorHandler` was added in `index.js`. It sends uncaught errors to `posthog.captureException(error, request.id)`, flushes the shared client, and then follows Fastify's normal response path. This wiring was reviewed but not runtime-exercised, so exception delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935610) was created with four insights covering post mutations over time, comments over time, the post lifecycle funnel, and post actions by publication state. The dashboard and insight metadata were returned successfully by PostHog; the run did not confirm incoming event data.

## What the run verified—and did not

Verified: dependency installation, the initialization and route/error-handler code changes by review, the environment key setup, and successful creation of the dashboard and its four tiles in PostHog. No build, typecheck, lint, test suite, server startup, or runtime event-delivery verification was performed. The package has no build, typecheck, or lint scripts. An attempted `npm run start` verification was blocked by runtime command policy, so the server was not exercised.

## Unresolved issue

No stable authenticated identity is available. Consequently, the four action events and exception correlation use request-scoped anonymous IDs rather than durable user attribution. If left unresolved, user-level funnels, retention, and cross-request attribution will remain fragmented or unavailable. The affected instrumentation and error boundary are in `index.js` at the capture/error-handler call sites (the action captures are around lines 41–51, 77–90, 119–130, and 155–164; the exception capture is around lines 5–8). Replace this only after a verified account identifier and authentication boundary exist; do not substitute `author`.

## Build conflicts

No build, typecheck, or lint script is defined in `package.json`. An attempted `npm run start` verification was blocked by the runtime command policy, so the server was not exercised. This is a verification limitation, not evidence of a source compilation failure.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment using the names documented in `.env.example`.
2. Run the production build/startup checks available in the deployment environment and run the test suite.
3. Exercise successful create, update, delete, and comment routes, then confirm the four event names arrive in PostHog and populate the dashboard.
4. Trigger a controlled application error and confirm the exception appears in PostHog error tracking.
5. Add authenticated identity wiring later if the application gains a verified user/account model.

## Before you merge

- [ ] Run a full production build (the wizard only reviewed the files it touched) and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in deployment environments, not only the local `.env`; verify the names in `.env.example` and `posthog.js`.
- [ ] Exercise the server routes and inspect `index.js` capture sites around lines 41–51, 77–90, 119–130, and 155–164 to confirm events arrive in PostHog.
- [ ] Trigger an application error and inspect the `index.js` error handler around lines 5–8 to confirm exception delivery.
