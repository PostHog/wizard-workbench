# PostHog setup report

PostHog server-side analytics was added to the Hono links API, with three mutation events, global error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-node` version `5.46.1` in `package.json` and `package-lock.json` using npm.
- Added the shared singleton in `posthog.js`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Enabled exception autocapture and configured `flushAt: 1` / `flushInterval: 0` so short-lived requests flush queued events.
- Added `.env.example` documenting the required environment variable names. The real values were configured in the local `.env` through wizard tooling; deploy environments still need their own configuration.

## Instrumented events

| Event | Measures | File |
|---|---|---|
| `link_created` | A new saved link is created, with tag-count and description-presence context. | `index.js` |
| `link_updated` | An existing saved link is updated, including favorite changes, with changed-field, favorite, and tag-count context. | `index.js` |
| `link_deleted` | A saved link is deleted, with prior favorite state and tag-count context. | `index.js` |

All three events are captured only after successful mutations and omit user-entered link content. No stable distinct ID was available because this API has no authentication, session, or user model; the events are intentionally personless.

## User identification

Identification was skipped. The application is an anonymous in-memory links API with no authenticated user identity to use safely. If authentication is added later, establish identity at the request boundary from the authenticated user's stable primary key; do not use link data or email as the distinct ID.

## Error tracking

`index.js` registers a global Hono `app.onError` handler. Uncaught errors are sent with `posthog.captureException(error)` and flushed before the generic 500 response. The shared client also enables exception autocapture. The run verified the code configuration by review, but did not observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918826)

The dashboard contains three insights covering link creation, combined update/deletion activity, and a link lifecycle funnel. It may be empty until the API receives traffic. The run did not observe events arriving in PostHog, so event delivery remains unconfirmed.

## What the run verified

- `posthog-node` installation completed successfully and resolved to `5.46.1`.
- The shared client, guarded capture calls, awaited flushes, and global error handler were reviewed.
- The dashboard and its three insights were created successfully.
- No build, typecheck, or lint command exists in `package.json`; no tests or runtime exercise were run.

## Unresolved issues and their cost

- **Runtime delivery is unresolved:** the run did not start the server or observe any event or exception arrive in PostHog. Until verified, the dashboard can remain empty and analytics completeness is unknown.
- **Stable attribution is unresolved by design:** `link_created`, `link_updated`, and `link_deleted` have no distinct ID because no identity source exists. Leaving this unchanged means these events cannot be reliably attributed to users if user-level analysis is later required.
- **Build-quality verification is unavailable:** no build, typecheck, or lint script is defined. Compilation and runtime behavior were therefore not verified by this run.

## Build conflicts

No code build conflict was reported. The project has no build, typecheck, or lint script beyond the long-running `start` and `dev` scripts, so those checks were not available. `npm install` reported one unrelated moderate npm audit vulnerability; no audit fix was run.

## Before you merge

- [ ] Run a full production build if one is available outside the current `package.json`, and fix any build, lint, or type errors introduced by the integration; review `posthog.js` and `index.js`.
- [ ] Run the test suite, if available, and update mocks or fixtures for the PostHog calls in `index.js`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only local `.env`; use the names documented in `.env.example` and verify `posthog.js` reads them.
- [ ] Exercise successful POST, PATCH, and DELETE requests and confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog; inspect the capture and flush paths in `index.js`.
- [ ] Exercise an uncaught application error and confirm it appears in PostHog Error Tracking; inspect `app.onError` in `index.js`.
- [ ] If authentication is introduced, wire a stable authenticated-user identifier at the request boundary before relying on user-level attribution; currently no identify call exists.
