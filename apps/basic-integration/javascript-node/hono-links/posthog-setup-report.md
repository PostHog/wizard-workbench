# PostHog setup report

A server-side PostHog integration was added to the Hono links API: the Node SDK is initialized from environment variables, successful link mutations emit three analytics events, and uncaught application errors are reported.

## Installed and initialized

- Installed `posthog-node` (`^5.46.1`) and `dotenv`; the manifest and lockfile were updated.
- Added a process-level singleton in `posthog.js` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Enabled exception autocapture and immediate flushing in the SDK configuration. Local `.env` loading is provided by `dotenv`; production is expected to provide the environment variables through the runtime environment.
- Documented the keys in `.env.example`. The run confirmed the keys are configured locally through the wizard environment tooling.
- No browser SDK, reverse proxy, or CSP change was needed because this is a server-side Node.js application.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `link_created` | A valid link is saved to the collection; records aggregate metadata such as tag count and whether a description exists. | `index.js` |
| `link_updated` | An existing link's saved attributes are changed; records changed-field names and aggregate/boolean state. | `index.js` |
| `link_deleted` | A link is removed from the collection. | `index.js` |

The captures run only after successful create, update, and delete mutations, and each route awaits the shared SDK's flush before returning. The run did **not** execute the application or observe events arriving in PostHog, so event delivery and runtime behavior remain unconfirmed.

## User identification

Identification was skipped. The application has no authentication, login, session, account, or user model, so no verified stable user ID reaches a request boundary. The events are intentionally personless; no fabricated distinct ID was added. If authentication is introduced later, bind its verified stable ID per request before capturing events and exceptions.

## Error tracking

A global Hono `app.onError` handler in `index.js` captures uncaught errors with `posthog.captureException`, includes only request path and method context, awaits `posthog.flush()`, and returns a generic 500 response. SDK exception autocapture also remains enabled. The run did not trigger an error and did not observe an exception arriving in PostHog, so error delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902600)

The dashboard contains daily trends for `link_created`, `link_updated`, and `link_deleted`, plus an ordered link lifecycle funnel. The insights were created against the intended event names; current event volume was not verified.

## What the run verified

- `npm install` completed successfully, and `npm add dotenv` completed successfully.
- The dependency manifest includes `posthog-node` and `dotenv`.
- The review confirmed there are no build, typecheck, or lint scripts in `package.json`.
- The source changes, initialization, event contract, error handler, and environment-key presence were reviewed.
- The dashboard and four tagged insights were created in PostHog project `483112`.

## What the run did not verify

- No production build, typecheck, lint, test suite, app startup, route request, or runtime error test was run.
- No event or exception was observed arriving in PostHog.
- No stable user identity could be established because the app has no authentication layer.

## Build and dependency conflicts

No build, typecheck, or lint script is defined, so those checks could not be run. Npm reports one moderate dependency audit vulnerability outside the integration scope; it was not addressed by this run. No other build conflict was reported.

## Before you merge

- [ ] Run a full production/build-equivalent check and add or run lint/type checks if introduced; inspect the PostHog initialization and route changes in `posthog.js` and `index.js` (especially lines 1–20 and 52–125).
- [ ] Run the test suite, or add request coverage for the instrumented mutation handlers in `index.js` lines 52–125, including mocks for `posthog.capture` and `posthog.flush` if applicable.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only locally; verify the exact names in `.env.example` lines 1–2.
- [ ] Exercise successful create, update, and delete requests and confirm `link_created`, `link_updated`, and `link_deleted` arrive in PostHog; inspect the call sites in `index.js` lines 69–78, 101–113, and 124–127.
- [ ] Trigger an uncaught application error and confirm exception delivery; inspect the global handler in `index.js` lines 6–16.
- [ ] Decide whether to remediate the moderate npm audit vulnerability reported during review, separately from this integration.
