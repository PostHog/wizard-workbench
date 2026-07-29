# PostHog setup report

PostHog server-side analytics was added to the Flask application with the Python SDK, request-scoped identity, twelve product events, centralized exception capture, and a starter dashboard.

## What was installed and initialized

- Installed the published `posthog` Python package, version 7.33.0, with `backoff` 2.2.1; `posthog` was added to `requirements.txt` without a pinned version.
- Initialized one PostHog client in `app/__init__.py` inside `create_app()` before blueprint registration, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `config.py` and enabling exception autocapture.
- Registered client shutdown at process exit and exposed the singleton as `app.posthog` for route handlers.
- Added the environment keys to `.env.example`; the real values were set in the local `.env` during the run. Values were not read back in verification.
- No CSP configuration was found or changed.

## Instrumented events

These are the events recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified that the capture call sites are guarded, use lower-snake-case names, avoid PII and user content in event properties, and occur after the corresponding action succeeds. The run did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An account successfully signs in through the browser form. | `app/auth/routes.py` |
| `user_registered` | A new browser account is created successfully. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated browser session is ended. | `app/auth/routes.py` |
| `post_created` | An authenticated user publishes a post. | `app/main/routes.py` |
| `profile_updated` | An authenticated user saves profile changes. | `app/main/routes.py` |
| `user_followed` | An authenticated user follows another account. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollows another account. | `app/main/routes.py` |
| `message_sent` | An authenticated user sends a direct message. | `app/main/routes.py` |
| `post_export_started` | An authenticated user starts an export of their posts. | `app/main/routes.py` |
| `api_token_issued` | An API client successfully issues an access token. | `app/api/tokens.py` |
| `api_token_revoked` | An API client revokes its active access token. | `app/api/tokens.py` |
| `api_user_registered` | A new account is successfully created through the API. | `app/api/users.py` |

## Identification and attribution

User identification was wired. Each request opens a PostHog context in `app/__init__.py`; authenticated users are identified by their stable numeric primary key, and browser login/registration plus API authentication establish identity after authentication. Email and username are stored as person properties rather than event properties. No per-event distinct ID is added.

This attribution behavior is based on the implementation review and handoffs; event delivery and attribution in a live deployment remain unconfirmed.

## Error tracking

`app/errors/handlers.py` now calls `app.posthog.capture_exception(error)` from the centralized Flask 500 handler before rendering or returning the error response. The run verified the handler change by review, but did not trigger an exception or observe an error in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926566) was created with four insights: Account lifecycle funnel, Authentication activity, Content engagement, and Profile and social actions. The dashboard and its tiles exist in PostHog; the dashboard may initially be empty because no ingestion was observed during this run.

## Verification status and unresolved issues

- Dependency installation succeeded: `pip install -r requirements.txt` completed and resolved `posthog` 7.33.0.
- The review found no build, typecheck, or lint configuration and therefore ran none. No application startup, test suite, production build, or live event-flow check was run.
- The SDK context APIs and constructor behavior were assumed to match the supplied Flask framework rules; this was not runtime-verified.
- **Unresolved attribution/runtime issue:** the run could not establish that the installed SDK's `new_context` and `identify_context` APIs behave as expected in this application, nor that the initialized singleton delivers events in production. If left unresolved, captures may fail, be unattributed, or never reach PostHog despite compiling successfully. Review the request-context setup in `app/__init__.py` and the authentication identification call sites in `app/auth/routes.py` and `app/api/auth.py`.
- No `DISTINCT_ID` placeholder was reported by any handoff.
- No build or dependency conflict was reported. The dashboard handoff explicitly reports `None` for conflicts.

## Next steps

1. Deploy with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configured in the deployment environment, not only in local `.env`.
2. Run the application and exercise browser authentication, content, social, messaging, export, and API flows; confirm the twelve named events arrive in the dashboard with stable user attribution.
3. Trigger a controlled 500 error and confirm it appears in PostHog Error Tracking.
4. Validate the request-context and identity APIs against the installed SDK in a real Flask request, especially if the application uses workers or async execution.

## Before you merge

- [ ] Run the full production build or application startup check and fix any errors introduced in `app/__init__.py`, `config.py`, `app/auth/routes.py`, `app/api/auth.py`, `app/main/routes.py`, `app/api/tokens.py`, `app/api/users.py`, and `app/errors/handlers.py` (the review found no build script, so this remains unverified).
- [ ] Run the test suite, especially fixtures and mocks covering the instrumented handlers in `app/auth/routes.py`, `app/main/routes.py`, `app/api/tokens.py`, `app/api/users.py`, and `app/errors/handlers.py`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment and verify the names against `.env.example` and `config.py` (the run only confirmed local `.env` presence).
- [ ] If authentication is used in production, exercise a returning authenticated session and confirm the identify path in `app/__init__.py` and `app/auth/routes.py` does not fragment users onto anonymous IDs.
- [ ] Exercise the request context and exception path in `app/__init__.py` and `app/errors/handlers.py`, then confirm events and exceptions actually arrive in PostHog; compilation and code review did not prove delivery.
