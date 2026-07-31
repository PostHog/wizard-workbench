# PostHog setup report

PostHog analytics was added to the Flask application with a shared server-side client, request-scoped user identity, 14 business events, centralized exception capture, and a starter dashboard.

## What was installed and initialized

- Installed the published Python `posthog` package, version 7.35.4, and declared `posthog` in `requirements.txt`.
- Added a shared instance-based client in `app/posthog.py`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with exception autocapture and shutdown registration.
- Initialized the client in `create_app()` before blueprint registration. Missing configuration is a development-time failure and a production no-op, per the framework rules.
- Added/documented configuration in `.env.example`; the configured runtime keys are present in `.env` and `.flaskenv`. The token and host were not hardcoded in application source.

## Events instrumented

These are the planned and instrumented event definitions recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified the corresponding guarded capture call sites by source inspection; it did **not** run the application or observe events arriving in PostHog.

| Event name | What it measures | File |
|---|---|---|
| `user_logged_in` | Authenticated user successfully signs in through the web form. | `app/auth/routes.py` |
| `user_logged_out` | Authenticated user signs out of the web application. | `app/auth/routes.py` |
| `user_registered` | A new account is successfully created through the registration form. | `app/auth/routes.py` |
| `password_reset_completed` | A verified account successfully sets a new password. | `app/auth/routes.py` |
| `post_created` | Authenticated user publishes a new microblog post. | `app/main/routes.py` |
| `profile_updated` | Authenticated user successfully saves profile changes. | `app/main/routes.py` |
| `user_followed` | Authenticated user successfully follows another account. | `app/main/routes.py` |
| `user_unfollowed` | Authenticated user successfully unfollows another account. | `app/main/routes.py` |
| `post_translated` | Authenticated user requests a post translation. | `app/main/routes.py` |
| `search_performed` | Authenticated user submits a valid post search. | `app/main/routes.py` |
| `message_sent` | Authenticated user successfully sends a direct message. | `app/main/routes.py` |
| `post_export_requested` | Authenticated user starts an export of their posts. | `app/main/routes.py` |
| `api_token_created` | Authenticated API user successfully creates an API token. | `app/api/tokens.py` |
| `api_token_revoked` | Authenticated API user revokes their API token. | `app/api/tokens.py` |

Event properties were limited to operational metadata such as lengths, result counts, and booleans. User-entered content and email/username values were not placed in event properties.

## Identification status

User identification was wired. Each request opens a fresh PostHog context; authenticated web and API users are identified using the stable database ID (`str(user.id)`), with person properties maintained separately. Login, registration, and password-reset flows re-establish identity where needed. Unauthenticated requests can carry analytics session/header context, but no stable authenticated user ID is available for those requests.

## Error tracking

`app/errors/handlers.py` now calls the shared client’s `capture_exception(error)` from the centralized Flask 500 handler. SDK exception autocapture remains enabled. This wiring was verified by source inspection only; the run did not trigger an exception or observe an error event in PostHog.

## Dashboard

The run created **Analytics basics (wizard)** with five tagged insights: registration trend, post creation trend, engagement actions trend, registration-to-first-post funnel, and API token lifecycle comparison.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1935603)

## What the run verified vs. what remains unconfirmed

Verified: `posthog` 7.35.4 installed; the dependency is declared; the configured environment keys are present; targeted source review passed; and `.venv/bin/python -m compileall app config.py microblog.py` passed after the changes. The dashboard and five insights were created successfully by PostHog MCP.

Unconfirmed: no application startup, automated tests, production build, or live event delivery check was run. The attempted Flask translation command could not be invoked because the harness blocks environment-variable-prefixed Flask commands. Dashboard definitions were created without requiring prior ingestion, so their presence does not prove that events have arrived.

## Build conflict

No integration conflict was reported. Flask translation compilation could not be invoked because the harness blocks environment-variable-prefixed Flask commands; this was a tooling restriction, not a reported project-code failure. No tests were run.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`/`.flaskenv` files.
2. Exercise registration, login, posting, engagement, messaging, export, and API-token flows in a deployed environment, then confirm the 14 named events and stable distinct IDs appear in PostHog.
3. Trigger a controlled 500 response and confirm the exception appears in PostHog Error Tracking.
4. Run the full production build and test suite, updating mocks or fixtures for the new client and capture calls.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced in `app/posthog.py`, `app/__init__.py`, `app/auth/routes.py`, `app/main/routes.py`, `app/api/auth.py`, `app/api/tokens.py`, and `app/errors/handlers.py`.
- [ ] Run the test suite and update mocks or fixtures for the PostHog client and capture calls, especially in `tests.py` and the instrumented route files.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in each deployment environment; inspect `config.py`, `.env.example`, and deployment configuration rather than relying on local `.env` or `.flaskenv`.
- [ ] Because authentication and identify are wired, exercise the returning-visitor path and confirm it calls identify rather than fragmenting users onto anonymous distinct IDs; inspect `app/__init__.py`, `app/posthog.py`, and `app/auth/routes.py`.
