# PostHog setup report

PostHog analytics was added to the Hono Node.js links API with a shared `posthog-node` client, three link-management event instruments, centralized exception capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` 5.46.1 using npm; `package.json` and `package-lock.json` were updated.
- Added the shared client in `posthog.js`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- The client enables `enableExceptionAutocapture: true`, fails loudly in development when configuration is missing, and remains a production no-op when unconfigured.
- The real configuration keys were written to the local `.env` through the wizard environment tool; `.env.example` documents both names with placeholders.
- All route and error instrumentation uses the shared client. Request captures and exception captures await `posthog.flush()`.

## Events instrumented

These events are instrumented in code. The run did **not** exercise the application or observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `link_created` | A new saved link is successfully created, with tag count and description-presence metadata. | `index.js` |
| `link_updated` | A saved link is successfully updated, with booleans identifying which fields changed. | `index.js` |
| `link_deleted` | A saved link is successfully deleted. | `index.js` |

## User identification

User identification was skipped. The application has an in-memory links collection but no authentication, users, sessions, login/signup flows, or stable user identifier. Events and exceptions are therefore intentionally personless; no fabricated distinct ID was added. If authentication is introduced, bind the authenticated primary key with request context before relying on these events for person-level analysis; never use an email as the distinct ID.

## Error tracking

A global Hono `app.onError` handler was added in `index.js`. It sends uncaught application errors through `posthog.captureException(err)`, flushes the client, and returns a generic HTTP 500 JSON response. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926588)

The dashboard contains daily trend insights for `link_created`, `link_updated`, and `link_deleted` over the last 30 days. The dashboard exists in PostHog, but its data will remain empty or incomplete until the application sends events; the run did not verify event arrival.

## What the run verified

- npm installation completed successfully and dependencies were synchronized.
- The review found no required fixes in the integration changes.
- The manifest has `start` and `dev` scripts only; there is no build, typecheck, or lint script to run.
- Environment-key presence was confirmed without exposing values.
- The event calls are present on successful POST, PATCH, and DELETE routes, and each has an awaited flush.

## What the run did not verify

- No application startup, production build, tests, lint, typecheck, or live request flow was run.
- No event or exception was observed arriving in PostHog.
- No stable user attribution is available.
- The dashboard's charts were not validated against received data.

## Build and dependency conflicts

No build conflict was found because the project defines no build, typecheck, or lint command. npm reported one moderate audit vulnerability during installation; it was not changed because dependency remediation is outside this integration scope.

## Issues to follow up

- **No user attribution:** `index.js` route captures and the global error capture currently have no authenticated distinct ID because the application has no identity model. If left unresolved after authentication is added, person-level funnels and retention analysis will be unavailable.
- **Unconfirmed delivery:** Event and exception delivery was not exercised. If left unverified, the dashboard may not reflect production activity despite compiling instrumentation.

## Before you merge

- [ ] Run the application’s production deployment/build validation (the manifest has no build script) and fix any errors introduced around `posthog.js` or `index.js`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the PostHog calls in `index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env` (`posthog.js`).
- [ ] Trigger successful POST, PATCH, and DELETE requests through the instrumented handlers in `index.js` and confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog.
- [ ] Trigger an application error through the global handler in `index.js` and confirm the exception appears in PostHog Error Tracking.
- [ ] If authentication is later introduced, add request-scoped identity using the authenticated primary key before treating events as person-level data (`index.js`).
