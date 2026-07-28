# PostHog setup report

PostHog server-side analytics was added to the Fastify blog API with anonymous mutation events, centralized error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` `^5.46.1` and `dotenv` `^17.4.2` with npm; the install handoffs report zero vulnerabilities.
- Added the shared client in `posthog.js`, initialized from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with `enableExceptionAutocapture: true`.
- Local environment values were configured in `.env` through the wizard, and `.env.example` documents the required variable names. Deployment must provide the same variables through the process environment.
- Successful mutation handlers await `posthog.flush()` so queued events are sent before the request returns.

## Events instrumented

These events are implemented in `index.js` and are captured only after their corresponding operation succeeds. The run did not observe events arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `post_created` | A visitor successfully creates a blog post. | `index.js` |
| `post_updated` | A visitor successfully updates a blog post, including publication changes. | `index.js` |
| `post_deleted` | A visitor successfully deletes a blog post. | `index.js` |
| `comment_created` | A visitor successfully adds a comment to a blog post. | `index.js` |

Event properties contain operational context only: resource IDs, publication state, changed field names, and deleted comment count. User-entered author, title, and body values are not sent as event properties.

## Identity

User identification was skipped. The API has no authentication, user records, sessions, login/signup flow, or stable user primary key. The request-body `author` field is user-entered content and is not suitable as a distinct ID. Events are therefore personless/anonymous. If authentication is added later, use its stable user ID and do not identify from author, title, body, or other user-entered values.

## Error tracking

A global `fastify.setErrorHandler` was added in `index.js`. It calls `posthog.captureException(error)` and awaits `posthog.flush()`, logs the error, and returns a generic 500 response. The shared client also enables exception autocapture. The run did not exercise an error request or observe an error arriving in PostHog, so error delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919745)

The dashboard contains five insights for daily post creation, post updates/publications, post deletions, comment creation, and a post-created-to-comment-created funnel. The dashboard handoff confirms creation and attachment of these insights; its 30-day charts may be empty until events arrive. No event-flow verification was performed during this run.

## Build and verification status

The run verified the dependency installation, source edits, event contract, environment variable documentation, and dashboard/insight creation. npm reported zero vulnerabilities for the dependency installs.

No production build, typecheck, lint, test suite, or application startup was run: `package.json` defines only `start` and `dev` scripts. Therefore compilation, runtime boot, event delivery, and error delivery remain unconfirmed.

### Unresolved issue to follow up

The application has no stable authenticated identity, so analytics cannot attribute these events to users. Leaving this unresolved means the dashboard can measure aggregate anonymous activity but cannot answer user-level retention, ownership, or per-user journey questions.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, using `.env.example` as the contract.
2. Run the production-equivalent startup/build checks available in the deployment pipeline.
3. Run the test suite and update mocks or fixtures if the new PostHog imports or error handler affect them.
4. Exercise each mutation route and an error path in a safe environment, then confirm the four event names and error issues appear in PostHog.
5. Decide whether a future authentication system should provide a stable distinct ID for `identify`.

## Before you merge

- [ ] Run the full production build or deployment-equivalent validation; this run had no build, typecheck, or lint script and did not compile or start the application.
- [ ] Run the test suite; this run did not execute tests, and instrumented call sites or the global error handler may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in each deploy environment, not only locally; the exact names are documented in `.env.example` and `posthog.js`.
- [ ] Exercise `index.js` mutation routes and the error path, then confirm `post_created`, `post_updated`, `post_deleted`, `comment_created`, and error data arrive in PostHog; delivery was not observed during this run.
