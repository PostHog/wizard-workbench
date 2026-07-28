# PostHog setup report

PostHog was added to the Fastify blog API with a shared environment-configured Node.js client, four lifecycle events, centralized exception capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` using npm. The install completed successfully; the handoff reports 52 packages added and zero vulnerabilities, and the review reports dependencies current with zero vulnerabilities.
- Added the shared singleton in `posthog.js`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `process.env`, fails loudly in non-production when either is missing, and is a production no-op when unconfigured.
- The client is constructed with `enableExceptionAutocapture: true`, `flushAt: 1`, and `flushInterval: 0`.
- The real environment values were configured in `.env` through wizard environment tooling; `.env.example` documents the required variable names without embedding secrets in source.
- `index.js` shuts the client down through Fastify's `onClose` lifecycle hook.

## Events instrumented

These events are captured after successful in-memory mutations in `index.js`. The run did **not** observe events arriving in PostHog, so ingestion and delivery remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `post_created` | A blog post was created successfully. | `index.js` |
| `post_updated` | An existing blog post was updated successfully. | `index.js` |
| `post_deleted` | A blog post and its associated comments were deleted successfully. | `index.js` |
| `comment_created` | A comment was added to a blog post successfully. | `index.js` |

The event properties use non-PII entity identifiers, publication state, and updated field names. Caller-supplied author, title, body, and comment content were not sent as event properties.

## Identification status

User identification was skipped. The application has no authentication, session, login, registration, logout, or stable user primary key. Caller-supplied `author` fields are untrusted content and cannot safely provide identity. The four lifecycle events are intentionally personless.

### Follow-up issue: attribution is unresolved

No stable distinct ID is available for the event call sites in `index.js`, so the events cannot currently be attributed to authenticated users. If left unresolved, dashboard activity remains personless and user-level analysis or reliable attribution will not be available. If authentication is added later, establish a request context with the authenticated stable user ID—not an author, email, or username—before these events are captured. The error handler can optionally use `x-posthog-distinct-id`, but that header is not an authenticated identity source by itself.

## Error tracking

`index.js` registers one Fastify `setErrorHandler`. It calls `posthog?.captureException(error, request.headers['x-posthog-distinct-id'])`, logs the error, and returns an appropriate HTTP error response. This wires uncaught Fastify route/application exceptions to PostHog Error Tracking. The run did not execute the application or observe an exception arriving in PostHog, so delivery is unconfirmed.

## Dashboard

The dashboard **Analytics basics (wizard)** was created with five tagged insights: trends for each of the four events and a `post_created`-to-`comment_created` funnel. The dashboard and tiles were confirmed by PostHog MCP; the dashboard intentionally references planned events even though current ingestion is empty.

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1918829)

## Build conflicts and validation limits

No build conflict was reported. The review ran `npm install` successfully. The project has only `start` and `dev` scripts; no build, typecheck, lint, or test script is configured, so those checks were not run. A passing install/review does not prove that events flow to PostHog, and this run did not observe event ingestion or exception delivery.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; no build, lint, or typecheck command is configured in `package.json`.
- [ ] Run the test suite; no test script is configured, and instrumented call sites in `index.js` may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env` (`posthog.js:3-4`; `.env.example`).
- [ ] Exercise successful post and comment mutations and verify `post_created`, `post_updated`, `post_deleted`, and `comment_created` arrive in PostHog; the run only verified capture call placement in `index.js` and did not observe ingestion.
- [ ] If authenticated identity is introduced, wire a stable authenticated distinct ID at the Fastify request boundary before relying on user attribution (`index.js:1-2` and the event capture call sites around lines 45-52, 83-90, 111-114, and 145-151).
- [ ] Exercise an uncaught Fastify/application exception and verify it appears in PostHog Error Tracking; the handler is present at `index.js:4-10`, but delivery was not observed during this run.
