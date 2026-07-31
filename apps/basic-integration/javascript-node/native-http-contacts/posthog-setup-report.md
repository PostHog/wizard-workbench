# PostHog setup report

PostHog server-side analytics and error tracking were added to the native Node.js contacts API, with a starter dashboard for the instrumented mutations.

## What was installed and initialized

- Installed `posthog-node` `^5.47.2` with npm and added `dotenv` `^17.4.2`; npm install/audit completed with 0 vulnerabilities.
- Created the shared client in `posthog.js`. It loads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment (local `.env` is loaded through `dotenv/config`), enables exception autocapture, and uses `flushAt: 1` and `flushInterval: 0`.
- Missing configuration fails loudly outside production and uses a production no-op when configuration is absent. The real environment keys were configured through the wizard tools; `.env.example` documents the key names.
- No browser CSP or reverse proxy was added because this is a server-only Node.js integration.

## Events instrumented

These captures are placed after successful in-memory mutations in `index.js` and contain non-PII properties. The run verified the instrumentation code and event plan, but did **not** start the application or observe events arriving in PostHog.

| Event name | What it measures | File |
|---|---|---|
| `group_created` | A caller successfully creates a contact group. | `index.js` |
| `contact_created` | A caller successfully creates a contact. | `index.js` |
| `contact_updated` | A caller successfully updates a contact. | `index.js` |
| `contact_deleted` | A caller successfully deletes a contact. | `index.js` |

## User identification

Identification was skipped. The API has no authentication, session, login/signup flow, or stable requester identity. The contact's name, email, phone, ID, or group is not used as an actor identity, so the four mutation events are intentionally personless. If authentication is added later, establish a stable authenticated-user ID at the request boundary before using request-scoped PostHog context.

## Error tracking

`index.js` captures request-handler exceptions in the global HTTP server catch block with `captureException()` and flushes them. It also registers handlers for `uncaughtException` and `unhandledRejection`, plus SIGINT/SIGTERM shutdown handling that flushes and shuts down the shared client. Request errors may use the `x-posthog-distinct-id` header when supplied; process-level errors have no user identifier. The run verified the code changes, but did not trigger an error or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935617)

The dashboard contains four attached daily trend insights for the exact event names above. The dashboard and insight definitions were created successfully, but are expected to remain empty until events are ingested; no event data was observed during this run.

## What the run verified—and did not verify

- Verified: dependencies were installed; the shared environment-based client and instrumentation were reviewed; the event plan lists four events; the dashboard was created with four matching insights; npm install/audit reported 0 vulnerabilities.
- Not verified: no production build, typecheck, lint, test suite, application start, live request, PostHog ingestion, or error capture was run. The manifest has no build, typecheck, lint, or check scripts. A generic `npm run` attempt was rejected because it was not a named verification script.

## Issues to follow up

- **No stable actor attribution is currently available.** All four mutation events are personless because the API has no authenticated identity. If attribution is needed, leaving this unresolved means dashboards cannot reliably segment actions by the person who performed them; add authentication and request-scoped stable IDs before relying on user-level analytics.
- **Runtime delivery remains unconfirmed.** No request was run and no event was observed in PostHog, so successful compilation/configuration should not be treated as proof of capture or ingestion.

## Before you merge

- [ ] Run a full production build (the wizard only reviewed the touched files) and fix any errors introduced by the integration; inspect `package.json` scripts and `posthog.js`.
- [ ] Run the test suite and update mocks or fixtures if needed; inspect the instrumented call sites in `index.js`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, using the exact names documented in `.env.example`; do not rely only on the local `.env`.
- [ ] Start the API and exercise each successful mutation route in `index.js` (group creation, contact creation, update, and deletion), then confirm the four events appear in PostHog and populate the [dashboard](https://us.posthog.com/project/483112/dashboard/1935617).
- [ ] Trigger a handled request error and, if appropriate, a process-level error in a safe environment, then confirm error tracking receives it; inspect the catch and process handlers in `index.js`.
