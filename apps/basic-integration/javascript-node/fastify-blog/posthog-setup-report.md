# PostHog setup report

PostHog server-side analytics was added to the Fastify blog API, with four write-action events, global exception capture, and a starter dashboard definition.

## Installed and initialized

- Installed `posthog-node` with npm; the dependency is recorded in `package.json` and `package-lock.json`. The install completed successfully with 53 packages audited and 0 vulnerabilities.
- `posthog.js` creates one module-level PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enableExceptionAutocapture`, and sets `flushAt: 1` and `flushInterval: 0`.
- Missing configuration is guarded: development throws the required descriptive error, while production leaves the client disabled. The environment keys were written to `.env` through wizard tooling and documented in `.env.example`.
- No browser CSP changes were needed; the review found no CSP in this server-only API.

## Events instrumented

These captures are wired in `index.js` after successful mutation operations. The run verified the call sites and event definitions, but did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `post_created` | A new blog post is successfully created. | `index.js` |
| `post_updated` | An existing blog post is successfully updated. | `index.js` |
| `post_deleted` | A blog post and its associated comments are successfully deleted. | `index.js` |
| `comment_created` | A comment is successfully added to a blog post. | `index.js` |

The event properties are operational and non-PII: post/comment IDs, published state, and deleted-comment count. Each guarded capture awaits `posthog.flush()`.

## Identification status

User identification was skipped. The API has no authentication, session, or stable user model. Request-supplied post and comment authors were not used as distinct IDs or event properties because they may contain PII. The custom events are therefore intentionally anonymous.

### Attribution issue to resolve

The error-tracking handoff described the Fastify request ID as the distinct ID, but the current `index.js` error handler calls `posthog.captureException(error)` without a distinct ID (line 133). Consequently, error attribution is unresolved and errors cannot currently be associated with even a request-scoped identifier. If request-level correlation is required, decide on a non-PII stable request identifier and wire it explicitly at `index.js:133`; authenticated user attribution still requires adding real authentication first.

## Error tracking

A global Fastify `setErrorHandler` was added in `index.js` (lines 131–139). When PostHog is configured, it captures exceptions and awaits a flush, logs the error, and returns a generic 500 response. The run verified the handler was added, but did not trigger an exception or observe an error event in PostHog.

## Dashboard

The dashboard **Analytics basics (wizard)** exists in project 483112 with four saved insights: post creations, post updates, post deletions, and a post-created-to-comment-created conversion funnel. The definitions may be empty until the application emits events.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1926581)

## Verification and limitations

- `npm install` completed successfully and reported 0 vulnerabilities.
- The review confirmed `posthog-node` is declared and the required environment keys are present by key-presence check; secret values were not exposed.
- No build, typecheck, lint, test suite, application startup, event delivery, or exception delivery was run. `package.json` defines only `start` and `dev`, so no build/typecheck/lint command was available.
- No build conflict was reported. This is not evidence that the application compiles or that events flow in a deployed environment.

## Before you merge

- [ ] Run a full production build or start validation for the deployment environment and fix any integration errors introduced by `posthog.js` or `index.js`.
- [ ] Run the test suite (if added by the project) and update mocks or fixtures for the PostHog client and mutation routes in `index.js`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only the local `.env`; verify the exact names documented in `.env.example`.
- [ ] Exercise each successful mutation route in `index.js` (lines 29–51, 68–84, 87–116, and 119–129) and confirm `post_created`, `post_updated`, `post_deleted`, and `comment_created` arrive in PostHog.
- [ ] Trigger the global error path at `index.js:131` and confirm the exception appears in PostHog; resolve the missing distinct-ID decision at `index.js:133` if request-level attribution is needed.
- [ ] If authentication is added later, wire a stable authenticated identifier at the request boundary and ensure returning sessions call identify rather than remaining anonymous.
