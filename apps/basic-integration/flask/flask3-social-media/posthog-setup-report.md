# PostHog setup report

PostHog analytics, request-scoped identity, exception tracking, twelve action events, and a starter dashboard were added to the Flask application.

## Installed and initialized

- Added the `posthog` Python package to `requirements.txt`.
- The run installed PostHog 7.31.0 and `backoff` 2.2.1; `pip install -r requirements.txt` completed successfully.
- `create_app()` constructs one instance-based `Posthog` client before blueprint registration, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from configuration.
- Exception autocapture is enabled, and client shutdown is registered with `atexit`.
- Missing configuration fails loudly in debug/testing and leaves production as a no-op; the variable names are documented in `.env.example`.
- A fresh request context carries session and stable authenticated `User.id` identity into captures and errors. Login, registration, and authenticated API flows re-identify users; email and username are person properties rather than event properties.

## Events instrumented

These are instrumented call sites planned by the run. The run did **not** exercise the application or observe events arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | User successfully signs in with credentials. | `app/auth/routes.py` |
| `user_registered` | New user account is created through the registration form. | `app/auth/routes.py` |
| `user_logged_out` | Authenticated user ends a web session. | `app/auth/routes.py` |
| `password_reset_completed` | User successfully completes a password reset. | `app/auth/routes.py` |
| `post_published` | Authenticated user publishes a post. | `app/main/routes.py` |
| `profile_updated` | Authenticated user saves profile changes. | `app/main/routes.py` |
| `user_followed` | Authenticated user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | Authenticated user unfollows another user. | `app/main/routes.py` |
| `message_sent` | Authenticated user sends a direct message. | `app/main/routes.py` |
| `posts_export_requested` | Authenticated user starts a post export job. | `app/main/routes.py` |
| `api_token_created` | Authenticated user creates or retrieves an API token. | `app/api/tokens.py` |
| `api_token_revoked` | Authenticated user revokes an API token. | `app/api/tokens.py` |

Event properties are limited to non-PII metadata such as post length, language-detected status, and message length. Background export completion was intentionally not instrumented because it runs outside a request context.

## Identification

Identification was wired. The request context prefers the authenticated database `User.id`; otherwise it can use the incoming analytics distinct-id header. Login, registration, password reset, and API authentication rebind identity where authentication occurs after the initial request hook. No browser client login/reset implementation was needed because this is a server-rendered Flask application.

## Error tracking

The centralized Flask 500 handler calls `capture_exception()` for the underlying uncaught exception through the initialized singleton while preserving existing rollback and response behavior. SDK exception autocapture is also enabled. The run did not trigger an exception or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914223)

The dashboard was created in project 483112 with five wizard-tagged insights covering authentication activity, registration-to-publishing conversion, content and messaging, social engagement, and account/export operations. Insights may initially be empty until events arrive.

## Verification and unresolved issues

- Dependency installation and review completed successfully.
- No project build, typecheck, lint, or test command was available; no automated test suite was run.
- The run did not verify network delivery, event arrival, dashboard population, or production boot with deployed environment variables.
- Export-job completion remains untracked. If that outcome becomes important, it needs a fresh context identified with the owning `User.id` before capture.
- No stable-id placeholder was reported at any capture call site. The remaining delivery question is operational: the deploy environment must provide the configured variables and the application flows must be exercised.

## Before you merge

- [ ] Run the full production build/startup path and fix any integration errors; the run only installed dependencies and reviewed the touched files. Check `app/__init__.py`, `config.py`, and `requirements.txt`.
- [ ] Run the test suite and update mocks or fixtures if instrumented routes affect them. Check `tests.py` and the route tests/callers covering `app/auth/routes.py`, `app/main/routes.py`, and `app/api/tokens.py`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` match the exact names in `.env.example` and are configured in every deployment environment, not only local `.env`. Check `.env.example`, `config.py`, and deployment configuration under `deployment/`.
- [ ] Exercise login, registration, publishing, profile, social, messaging, export-request, and token flows in a configured environment, then confirm the twelve planned events arrive and the dashboard populates. Check the capture call sites in `app/auth/routes.py`, `app/main/routes.py`, and `app/api/tokens.py`.
- [ ] Trigger a representative uncaught 500 in a safe environment and confirm the underlying exception appears in PostHog. Check `app/errors/handlers.py` and the initialization in `app/__init__.py`.
- [ ] If the export worker is later instrumented, open a new identified PostHog context for the job owner before adding capture. Check the export flow in `app/main/routes.py` and its worker implementation.
