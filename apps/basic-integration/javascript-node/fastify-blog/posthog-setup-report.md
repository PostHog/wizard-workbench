# PostHog setup report

## Summary

Installed and initialized the PostHog Node.js SDK for the Fastify blog API, instrumented four successful mutation events, added centralized exception capture, and created a starter dashboard. The run verified installation and code review only; it did **not** run the application or observe events arriving in PostHog.

## Installed and initialized

- Installed `posthog-node` with npm. Installation completed successfully; npm reported 53 audited packages and zero vulnerabilities.
- Added a shared PostHog client in `posthog.js`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Enabled exception autocapture and immediate batching/flush behavior.
- Added the documented environment variable names to `.env.example`; the real values were configured in `.env` during the run.
- Imported the shared client into `index.js`. Successful route captures await `posthog.flush()`, and Fastify shutdown awaits `posthog.shutdown()`.
- No browser SDK or CSP changes were applicable because this is a server-side Fastify application.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `post_created` | A valid blog post was created successfully. | `index.js` |
| `post_updated` | An existing blog post was updated successfully. | `index.js` |
| `post_deleted` | An existing blog post and its comments were deleted successfully. | `index.js` |
| `comment_created` | A valid comment was added to a blog post successfully. | `index.js` |

The events use non-PII operational properties such as resource IDs, publication state, changed-field booleans, and deleted-comment count. They are currently personless: no trusted authenticated user ID exists in the application, and request-provided author values were correctly not used as identity or event properties.

**Run verification boundary:** the event contract and matching capture call sites were reviewed, but the app was not started and no event delivery was observed. Dashboard insights may therefore be empty until the instrumented routes are exercised in a configured environment.

## User identification

Identification was skipped because the visible Fastify API has no authentication, session, login/signup/logout flow, user model, stable user ID, or trusted request identity. If authentication is added later, establish request-scoped identity from a trusted stable account ID; do not use the request-provided `author` field.

## Error tracking

Added a Fastify `setErrorHandler` in `index.js`. Uncaught errors are sent through `posthog.captureException(error, String(request.id))`, flushed before the response, logged, and returned as a generic 500 response. The shared client is shut down through Fastify’s `onClose` hook. Error capture was configured and reviewed, but no runtime error was generated or observed in PostHog during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914232)

The dashboard contains daily trends for the four events above and an ordered 14-day `post_created` → `comment_created` funnel. The dashboard and five insights were created successfully in PostHog, but their live data was not validated during this run.

## Build and validation status

There was no build conflict. `npm install` completed successfully with zero vulnerabilities. `package.json` contains only `start` and `dev` scripts; no build, typecheck, lint, or test script was available. Consequently, no build, typecheck, lint, test suite, application startup, or event-flow verification was run. A passing install/review does not prove that the server boots or that events reach PostHog.

## Follow-up issues

- **Runtime delivery remains unresolved:** no configured server was started and no events were observed arriving in PostHog. If left unresolved, the dashboard and error-tracking views may remain empty despite the instrumented code.
- **Identity remains unresolved by design:** events cannot be attributed to authenticated users because the application has no trusted stable identity source. If user-level analysis is needed, leaving this unchanged means all current product events remain personless.

## Before you merge

- [ ] Run a full production build or equivalent application validation and fix any lint or type errors introduced by the generated code. The project currently has no build, lint, or typecheck script in `package.json`.
- [ ] Run the test suite, or add/run appropriate route tests; instrumented call sites may need updated mocks or fixtures. No test script is currently defined in `package.json`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only locally; the exact names are documented in `.env.example` and initialization is in `posthog.js`.
- [ ] Start the configured server and exercise successful create, update, delete, and comment routes in `index.js`; confirm `post_created`, `post_updated`, `post_deleted`, and `comment_created` appear in PostHog.
- [ ] Trigger an uncaught Fastify error and confirm exception data appears in PostHog; inspect the `setErrorHandler` in `index.js`.
- [ ] If authenticated user analytics is later required, add a trusted stable user ID and wire request-scoped identification before relying on person-level attribution; the current identity decision is documented in the identify handoff.
