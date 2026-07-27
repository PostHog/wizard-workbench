# PostHog setup report

A server-side PostHog integration was added to the Hono links API, covering link lifecycle events and uncaught request errors, with a starter dashboard and funnel.

## Installed and initialized

- Installed `posthog-node` at `^5.46.1`; `npm install` completed successfully and generated/updated `package-lock.json`.
- Added the shared SDK singleton in `posthog.js`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables, fails loudly in non-production when either is missing, and remains a production no-op when configuration is absent.
- The client is initialized with `enableExceptionAutocapture: true`, `flushAt: 1`, and `flushInterval: 0`.
- `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the run confirmed both keys are present in the local `.env`.
- No reverse proxy or browser CSP changes were needed: this is server-side `posthog-node` instrumentation, and no CSP was present in the changeset.

## Instrumented events

These events are captured only after successful mutations and followed by an awaited flush. The run verified the call sites and event plan, but did **not** run the application or observe events arriving in PostHog; ingestion is therefore unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `link_created` | A new saved link is created successfully. | `index.js` |
| `link_updated` | An existing saved link is updated successfully. | `index.js` |
| `link_deleted` | A saved link is deleted successfully. | `index.js` |

The events use bounded, non-PII properties and are explicitly personless. No stable distinct ID is supplied because this API has no accounts, sessions, or stable user identity.

## User identification

Identification was skipped. The application is an unauthenticated in-memory links API with no user model, login/signup flow, session, or stable identity source. No identity was invented and no mutable or PII request data was used as a distinct ID. If authentication is added later, identify from the authenticated user's stable primary key at the request boundary and keep email/name as person properties.

## Error tracking

A global Hono `app.onError` handler was added in `index.js`. It calls `captureException(err)` on the shared client, awaits `flush()`, and returns a generic 500 JSON response. The run verified this source wiring, but did not trigger an error and did not observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914230)

The dashboard contains daily trends for all three lifecycle events and an ordered 14-day `link_created` → `link_updated` → `link_deleted` funnel. The dashboard and insights were created successfully, but may remain empty until events are ingested.

## What the run verified—and did not

- Verified: dependency installation, environment-based SDK initialization, route capture call sites, awaited flushes, personless event properties, global error-handler wiring, and successful creation of the dashboard and four insights.
- Not verified: production build, typecheck, lint, test execution, application startup, event delivery, exception delivery, or populated dashboard data. `package.json` defines only `start` and `dev`; no build, typecheck, or lint script was available.

## Build and dependency conflict

No project build, typecheck, or lint scripts are defined, so those checks could not be run. `npm install` was clean. `npm audit` reported one moderate dependency vulnerability; the review classified it as unrelated to the integration changes and did not remediate it.

## Unresolved issue to follow up

- **No stable attribution:** `index.js` events and error tracking have no authenticated distinct ID because none exists in the current application. If identity is left unresolved after authentication is introduced, lifecycle activity and errors cannot be reliably attributed to users; establish the stable user primary key at that boundary before relying on user-level analysis.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; no such command exists in `package.json`, so the wizard could not verify it.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites; no test script was defined or run.
- [ ] Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, using the exact names documented in `.env.example`, not only the local `.env`.
- [ ] Review `posthog.js` lines 3–17 to confirm deployment configuration and non-production missing-variable behavior match the target environment.
- [ ] Exercise successful POST, PATCH, and DELETE link mutations in `index.js` lines 35–118 and confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog.
- [ ] Trigger an uncaught route error and review `index.js` lines 6–13 to confirm exception delivery and the generic 500 response in the deployed environment.
- [ ] Reassess the one moderate `npm audit` vulnerability before release and decide whether an approved dependency update is appropriate.
