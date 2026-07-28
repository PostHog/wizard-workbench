# PostHog setup report

PostHog analytics and error tracking were added to the Flask application, with 12 request events, authenticated-user context, and a starter dashboard.

## What was installed and initialized

- Added the `posthog` Python SDK to `requirements.txt`; version 7.32.0 was installed successfully during review.
- Configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `config.py`, documented them in `.env.example`, and set the real values in the local `.env` through the wizard environment tools.
- `create_app()` constructs one instance-based `Posthog` client before blueprint registration, enables exception autocapture, registers shutdown at process exit, and exposes the shared client as `app.posthog`.
- Development/debug startup fails clearly when either PostHog environment variable is missing; production without configuration remains a safe no-op.
- Each request gets a fresh PostHog context. Authenticated users use their stable database ID, while anonymous browser tracing headers are accepted when no authenticated user is available. Email and username are person properties, not event properties.

## Events instrumented

These are instrumented call sites recorded in the event plan. The run did not exercise the application or observe any event arriving in PostHog, so this is an implementation inventory, not a delivery confirmation.

| Event | What it measures | Source file |
|---|---|---|
| `user_logged_in` | Authenticated user successfully signs in through the web form. | `app/auth/routes.py` |
| `user_logged_out` | Authenticated user signs out of the web application. | `app/auth/routes.py` |
| `user_registered` | New account registration completes successfully. | `app/auth/routes.py` |
| `password_reset_completed` | Account password reset completes successfully. | `app/auth/routes.py` |
| `post_created` | Authenticated user publishes a new post. | `app/main/routes.py` |
| `profile_updated` | Authenticated user saves profile changes. | `app/main/routes.py` |
| `user_followed` | Authenticated user follows another account. | `app/main/routes.py` |
| `user_unfollowed` | Authenticated user unfollows another account. | `app/main/routes.py` |
| `message_sent` | Authenticated user sends a direct message. | `app/main/routes.py` |
| `post_export_started` | Authenticated user begins exporting their posts. | `app/main/routes.py` |
| `api_token_created` | Authenticated API client creates an access token. | `app/api/tokens.py` |
| `api_token_revoked` | Authenticated API client revokes its access token. | `app/api/tokens.py` |

`post_created` includes only the non-PII metadata property `language_detected`. Export completion was not instrumented because it runs in an RQ background job without request identity.

## Identification status

User identification was wired. Login, registration, password reset, and authenticated API flows establish the stable user ID in the request context; person properties are set where the account is newly authenticated or created. Normal captures inherit this context and do not put PII in event properties. No `DISTINCT_ID` placeholder was introduced.

## Error tracking

The global Flask 500 handler in `app/errors/handlers.py` calls the shared client's `capture_exception()` for uncaught server exceptions, preserving the existing rollback and response behavior. The SDK is also initialized with exception autocapture enabled. This wiring was inspected but no exception was triggered, so delivery to PostHog remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918211)

The dashboard was created with five wizard-tagged insights covering registration, content creation, engagement, account lifecycle, and messaging/export activity. The insights use the instrumented event names and were intentionally created even though ingestion was not verified.

## What the run verified vs. did not verify

### Verified

- `pip3 install -r requirements.txt` completed and resolved PostHog 7.32.0.
- `python3 -m compileall app config.py microblog.py` completed successfully.
- The review found and fixed request-context exception forwarding in `app/__init__.py`.
- The dashboard and five saved insight tiles were returned successfully by PostHog.
- Source review found 12 capture call sites matching the 12-event manifest.

### Not verified

- No application startup, end-to-end request flow, event delivery, or exception delivery was exercised.
- No automated test suite was run; upstream handoffs reported no permitted automated test runner.
- Event ingestion and dashboard data are therefore unconfirmed.
- The documented `flask translate compile` command could not run because the runtime command allowlist blocked it, not because of a project compilation error.

## Issues to follow up

- Translation compilation remains unresolved: the available build-like command `flask translate compile` was blocked by the runtime command allowlist. If translation assets are part of release validation, run it in the project’s normal development/CI environment; otherwise this verification gap remains.
- Export completion analytics remain unresolved: `post_export_started` is captured in `app/main/routes.py`, but the RQ export worker has no corresponding completion event or explicit stable user context. Leaving this unresolved means the dashboard can show starts but cannot measure completed exports or attribute them reliably.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard only verified Python compilation with `python3 -m compileall app config.py microblog.py`.
- [ ] Run the test suite; the instrumented call sites in `app/auth/routes.py`, `app/main/routes.py`, and `app/api/tokens.py` may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only the local `.env`.
- [ ] Exercise representative login, registration, post, profile, follow, messaging, export, and API-token flows, then confirm the corresponding events arrive in PostHog and populate the dashboard.
- [ ] Trigger an uncaught 500 and confirm the exception appears in PostHog Error Tracking; the capture path is `app/errors/handlers.py`.
- [ ] If authentication supports returning sessions in deployment, verify the returning-visitor path continues to identify the stable user rather than fragmenting onto an anonymous distinct ID; the request binding is in `app/__init__.py`.
