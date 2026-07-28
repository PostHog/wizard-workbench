# PostHog setup report

PostHog analytics was added to the Fastify blog API with server-side event capture, error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-node` `^5.46.1` and `dotenv` `^17.4.2`; `package-lock.json` was generated or updated. The install completed successfully and npm reported 0 vulnerabilities.
- Added `posthog.js`, which loads environment configuration with `dotenv/config` and creates one PostHog singleton from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Initialization enables exception autocapture and uses `flushAt: 1` and `flushInterval: 0`; route captures and error captures await `flush()`.
- `.env.example` documents both required variable names. The run confirmed both variables are present locally through the environment-key check; their deployed environment configuration was not verified.
- The app is server-only, so no browser SDK, reverse proxy, or CSP changes were made.

## Events instrumented

These events are implemented in `index.js` and are captured only after the corresponding mutation succeeds:

| Event | What it measures | File |
|---|---|---|
| `post_created` | A blog post was successfully created. | `index.js` |
| `post_updated` | An existing blog post was successfully updated, including which fields changed and its published state. | `index.js` |
| `post_deleted` | A blog post and its associated comments were successfully deleted, including the deleted comment count. | `index.js` |
| `comment_created` | A comment was successfully added to a blog post. | `index.js` |

Event properties contain non-sensitive identifiers and state/change indicators only. Titles, bodies, and author values are not captured.

The run verified that these capture calls and awaited flushes are present in the source. It did **not** observe events arriving in PostHog, because the application was not started and no mutation requests were exercised. The dashboard insights are therefore expected to remain empty until traffic is generated.

## User identification

Identification was skipped. The API has no authentication, user records, sessions, or stable user primary key. The request `author` field is mutable content metadata and was correctly not used as a distinct ID. These events are intentionally personless for now. If authenticated users are added later, request-scoped context should use their stable, non-PII ID so existing captures inherit attribution.

## Error tracking

`index.js` registers a global Fastify `setErrorHandler` that calls `posthog.captureException(error)` and awaits `posthog.flush()` before preserving Fastify's normal error response. The run verified this source wiring, but did not trigger an application error or observe an error event in PostHog.

## Dashboard

The `Analytics basics (wizard)` dashboard was created with four daily trends tiles for the instrumented events over the last 30 days. Dashboard URL: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918234)

The dashboard and four insights were confirmed created by PostHog. Their data population was not verified; the run recorded that they are expected to be empty until the new events are ingested.

## Unresolved issues and impact

- **No stable identity is available:** `index.js` has only client-supplied `author` fields and no authenticated identifier. Until authentication supplies a stable ID, event activity cannot be attributed to users or reliably analyzed by user. Do not replace this with `author`, a post ID, an email, or a name.
- **Event delivery was not end-to-end verified:** the run verified code placement and flush calls, but did not run the server or observe events in PostHog. Dashboard conclusions must wait for a real request-and-ingestion check.
- **Build/test verification was unavailable:** `package.json` defines only `start` and `dev`; it has no build, typecheck, lint, or test scripts. Dependency installation succeeded, but no application build, startup, test suite, or lint/typecheck run was recorded.

## Build conflicts

No build conflict was reported. A build was not run because the project exposes no build script, so compilation and runtime compatibility remain unconfirmed.

## Before you merge

- [ ] Run the production/startup path and exercise create, update, delete, and comment routes; inspect `index.js` lines 24–139 and confirm `post_created`, `post_updated`, `post_deleted`, and `comment_created` arrive in PostHog.
- [ ] Trigger an application error and inspect `index.js` lines 143–150 to confirm the exception reaches PostHog Error Tracking.
- [ ] Run the project's test suite if one is added or available, updating mocks/fixtures for the PostHog singleton and route flushes.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`.
- [ ] If authentication is introduced, wire a stable non-PII request identity before relying on user-level analysis; do not use the `author` fields in `index.js`.
