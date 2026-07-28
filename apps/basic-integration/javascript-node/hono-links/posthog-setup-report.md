# PostHog setup report

PostHog server-side analytics was added to the Hono Node.js service for link creation, updates, deletions, and uncaught exceptions.

## What was installed and initialized

- Installed `posthog-node` (`^5.46.1`) with npm; `package.json` and `package-lock.json` were updated.
- Added a process-wide singleton in `posthog.js`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- The singleton enables exception autocapture and immediate flushing (`flushAt: 1`, `flushInterval: 0`). Captures are guarded, and route handlers await `posthog.flush()`.
- `index.js` imports the shared singleton. The `start` and `dev` scripts load the existing `.env` through Node's `--env-file-if-exists=.env` option.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were confirmed present in `.env` via wizard tooling. Their values were not exposed in the run.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `link_created` | A new saved link was successfully created | `index.js` |
| `link_updated` | An existing saved link was successfully updated | `index.js` |
| `link_deleted` | An existing saved link was successfully deleted | `index.js` |

The event properties are operational and non-PII: tag counts, description presence, updated field names, and favorite state.

These are instrumented call sites, not verified deliveries. The run did not execute the application or observe events arriving in PostHog, so event flow remains unconfirmed.

## User identification

Identification was skipped. The service has no authentication, login, signup, logout, session, or user model from which to derive a stable user identifier. Current captures are intentionally personless. If authentication is added later, establish request-scoped context from a stable authenticated user ID, never an email or name.

## Error tracking

A global Hono `app.onError` handler was added in `index.js`. It calls `posthog.captureException(err)`, awaits `posthog.flush()`, and returns a generic JSON 500 response. The shared client also enables exception autocapture. No exception delivery was observed during this run.

## Dashboard

Created **Analytics basics (wizard)** with daily trend tiles for the three instrumented events over the last 30 days. The dashboard exists as PostHog dashboard ID `1919750`; the run did not include a returned dashboard URL. [Open the dashboard](https://us.posthog.com/project/483112/dashboard/1919750)

## What the run verified—and did not

### Verified

- `posthog-node` is declared and npm installation completed successfully.
- The singleton, route captures, flushes, and global error handler were added according to the recorded handoffs.
- The environment keys are present locally, without exposing their values.
- The dashboard and three insights were created in PostHog.
- No build, typecheck, lint, or test scripts exist in `package.json`, so none were run.

### Not verified

- No production build, test suite, lint, or typecheck was run.
- No request was exercised and no analytics event or exception was observed arriving in PostHog.
- The runtime support for Node's `--env-file-if-exists` option was assumed from the SDK's documented Node engine range and was not independently verified.

## Issues to follow up

- The dependency tree contains one moderate npm vulnerability. It was reported by npm; no audit fix was run because remediation was outside the installation task.
- Attribution remains unresolved because the application has no stable identity source. Leaving the service personless means link activity cannot be attributed to authenticated users until authentication and request-scoped stable IDs exist.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; no build, lint, or typecheck script was available to the wizard.
- [ ] Run the test suite and update mocks or fixtures for the PostHog calls; no test script was available to the wizard.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only locally; inspect `.env.example`, `posthog.js`, and the `start`/`dev` scripts in `package.json`.
- [ ] Exercise successful create, update, and delete routes in `index.js`, then confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog.
- [ ] Exercise the global error path in `index.js` and confirm the exception appears in PostHog Error Tracking.
- [ ] If authentication is added, wire a stable authenticated user ID into request-scoped PostHog context before relying on user attribution.
