# PostHog setup report

PostHog analytics was added to the Python meeting-summarizer backend with a shared environment-configured client, authenticated request identity, eight business events, uncaught-exception autocapture, and a starter dashboard.

## Installed and initialized

- Added the `posthog` dependency to `requirements.txt`.
- `pip install posthog` completed successfully with PostHog Python SDK 7.31.0 and `backoff` 2.2.1; the later requirements installation also completed with dependencies satisfied.
- `posthog_client.py` creates one instance-based `Posthog` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enable_exception_autocapture=True`, and registers SDK shutdown with `atexit`.
- `server.py` imports and reuses that singleton rather than creating additional clients.
- `.env.example` documents the two configuration keys. The real keys are present in the local `.env` according to the wizard key check; their values were not read into this report.
- The application does not load `.env` itself. The deployment or startup environment must supply these variables before the process starts.

## Events instrumented

| Event | What it measures | Source |
|---|---|---|
| `login_succeeded` | An active user successfully signs in. | `server.py` |
| `login_failed` | A submitted sign-in attempt does not authenticate an active user. | `server.py` |
| `logout_completed` | An authenticated user ends their session. | `server.py` |
| `user_created` | An authenticated user creates an account record. | `server.py` |
| `meeting_created` | An authenticated user submits a meeting and its AI summary is saved. | `server.py` |
| `user_updated` | An authenticated user updates an account record. | `server.py` |
| `user_deleted` | An authenticated user deletes an account record. | `server.py` |
| `meeting_deleted` | An authenticated user deletes one of their saved meetings. | `server.py` |

The event properties are limited to non-PII metadata such as counts, booleans, duration, transcript length, and failure category. The failed-login event is intentionally personless because there is no authenticated user at that point.

## Identity

User identification was wired. Each HTTP verb enters a request-scoped PostHog context. Authenticated requests identify the context with the durable `User.user_id` UUID, and successful login uses a nested authenticated context after session creation. The user's email is set as a person property rather than sent as an event property. No browser SDK or frontend identity flow exists in this application.

This was verified by review of `server.py` and the identify handoff. The run did not start the application or observe events arriving in PostHog, so event delivery and runtime attribution remain unconfirmed.

## Error tracking

Uncaught exception tracking is enabled through the shared Python SDK client with `enable_exception_autocapture=True`. No manual `capture_exception` calls or route wrappers were added. Existing locally caught request exceptions were not changed. The run did not execute the application, so actual exception ingestion was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914287)

The dashboard contains five tagged insights: Authentication activity, Meeting activity, Account lifecycle, Login to meeting activation funnel, and Session engagement. They reference the instrumented event names. The dashboard and insights were created successfully, but fresh integrations may be empty until events are ingested; no event arrival was observed during this run.

## Build and verification status

- Dependency installation succeeded.
- No build, typecheck, or lint command is defined for this requirements-only project.
- No application startup, test suite, or production build was run.
- Therefore, compilation/build success and event flow cannot be claimed from this run. The review confirmed the edited integration structure and applied a guard around the successful-login capture so missing optional PostHog configuration does not break authentication.

## Issues requiring follow-up

1. **Runtime environment loading is unresolved.** `posthog_client.py` reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, while this standard-library application does not load `.env` itself. If the deployment does not inject those variables, analytics will use the safe no-op path. Confirm deployment configuration and startup behavior before relying on analytics.
2. **Event delivery was not established.** No run observed any event arrive in PostHog. Without a live configured process and exercised routes, dashboard results and exception ingestion remain unconfirmed.
3. **No build/test verification was available.** The project has no configured build, lint, typecheck, or test command recorded by the review step; run the applicable checks in the target environment.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment using the names documented in `.env.example`.
2. Start the application with the configured environment and exercise login, logout, account, and meeting routes.
3. Confirm the eight events arrive with stable UUID-based attribution and verify the dashboard populates.
4. Trigger a controlled uncaught exception in a non-production environment and confirm exception tracking reaches PostHog.
5. Run the project's full available test and production validation commands before merging.

## Before you merge

- [ ] Run a full production build or equivalent startup validation and fix any errors introduced by the integration; this run had no build command to execute.
- [ ] Run the test suite or the project's available checks; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in deployment environments, not only in the local `.env`; inspect `posthog_client.py` and deployment startup configuration.
- [ ] Start the configured application and verify events arrive in PostHog; inspect the capture call sites in `server.py` and the dashboard linked above.
- [ ] Because auth identification is wired, verify a returning authenticated session also identifies with the stable user UUID; inspect the request-context and login handling in `server.py`.
