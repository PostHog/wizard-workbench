# PostHog setup report

PostHog was installed and initialized for the Flask application with request-scoped user attribution, 13 server-side events, centralized exception capture, and a starter dashboard.

## What the run verified

### Installation and initialization

- The Python `posthog` package was installed successfully at version 7.32.0, and `posthog` was added to `requirements.txt`.
- `app/__init__.py` creates one `Posthog` client during `create_app()`, before blueprint registration, with exception autocapture enabled. The client is exposed as `app.posthog`, and shutdown is registered at process exit.
- `config.py` reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; `.env.example` documents both names. The real keys were present in `.env` during the run (values were not exposed in the run record).
- Missing configuration is handled as a development/testing error and a production no-op, according to the initialization handoff.

### Events instrumented

The run statically verified 13 planned `capture()` calls. No event was observed arriving in PostHog during this run, so the table describes instrumentation rather than confirmed traffic.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A registered user successfully signs in through the browser form. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated user ends their browser session. | `app/auth/routes.py` |
| `user_registered` | A new account is successfully created through the browser registration form. | `app/auth/routes.py` |
| `password_reset_completed` | A verified user successfully completes a password reset. | `app/auth/routes.py` |
| `post_created` | An authenticated user publishes a post. | `app/main/routes.py` |
| `profile_updated` | An authenticated user saves profile changes. | `app/main/routes.py` |
| `user_followed` | An authenticated user follows another account. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollows another account. | `app/main/routes.py` |
| `translation_requested` | An authenticated user requests translation of a post. | `app/main/routes.py` |
| `message_sent` | An authenticated user successfully sends a direct message. | `app/main/routes.py` |
| `post_export_requested` | An authenticated user starts an export of their posts. | `app/main/routes.py` |
| `api_token_created` | An authenticated API user creates an access token. | `app/api/tokens.py` |
| `api_token_revoked` | An authenticated API user revokes their access token. | `app/api/tokens.py` |

Captures use lower-snake-case names and only non-PII event properties: `remember_me`, `language_detected`, and translation language codes. Password-reset requests, search, and page views were intentionally not instrumented.

### Identification

Identification was wired, not skipped. A PostHog context is opened for each request and uses the authenticated Flask-Login user's stable primary key. Anonymous requests can use an incoming PostHog distinct-id header, and browser login/registration plus Basic or token API authentication re-identify the current request after authentication succeeds. Email and username are person properties, not event properties. There is no browser SDK in this Flask application.

### Error tracking

`app/errors/handlers.py` now captures the underlying exception with the shared `app.posthog.capture_exception()` in the centralized 500 handler, while preserving rollback and existing JSON/HTML responses. Initialization also enables exception autocapture. This was statically reviewed; no production exception was generated or observed in PostHog during the run.

### Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1919724)

The dashboard contains four wizard-tagged insights: Authentication activity, Social engagement activity, Registration to first post funnel, and Translation and export usage. The dashboard and insights were created successfully, but their charts may be empty until application traffic arrives.

## What the run did not verify

- No event delivery was observed; successful compilation does not prove that events flow to PostHog.
- No application startup, full production build, lint, typecheck, or test suite was run. The available verification was `.venv/bin/pip install -r requirements.txt` followed by `python -m compileall app config.py microblog.py`, which passed.
- No live identify behavior or error event was observed in PostHog.
- No CSP changes were needed because the review found no existing CSP.

## Issues to follow up

- **Runtime delivery remains unresolved:** the run only performed static verification and compilation. Without exercising the routes and checking PostHog, event delivery, request attribution, and exception capture remain unconfirmed; leaving this unresolved could produce an empty dashboard or unattributed events.
- **SDK API compatibility remains an assumption:** the run assumed PostHog 7.32.0 supports the instance context APIs and `enable_exception_autocapture=True` constructor option used by the integration. Leaving this unverified could prevent events or exceptions from being sent at runtime.
- **Translation input shape remains an assumption:** the capture relies on the existing route's source and destination language fields. If those fields differ in deployed traffic, `translation_requested` may fail or lose its intended properties.

## Build conflicts

No build, typecheck, or lint script is defined in the project metadata. Python compilation was used as the available build verification and passed. Tests were intentionally not run.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment using the names documented in `.env.example`; do not rely only on the local `.env`.
2. Run the application through representative registration, login/logout, posting, profile, follow/unfollow, translation, messaging, export, password-reset, and API-token flows.
3. Confirm the resulting events and stable person attribution in PostHog, and deliberately exercise a 500 path to confirm Error Tracking receives the exception.
4. Review the dashboard after traffic arrives and confirm its four insights match the desired product questions.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; this run only passed Python compilation (`app/__init__.py`, `config.py`, and the touched route/error files).
- [ ] Run the test suite and update mocks or fixtures for the new PostHog client and capture calls; no tests were run in this run (`tests.py` and the instrumented call sites are the places to inspect).
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in each deploy environment, not only local `.env`; verify the names documented in `.env.example` and read by `config.py`.
- [ ] Exercise an authenticated returning-user request and confirm it remains attached to the stable user identity; inspect the request context and re-identification paths in `app/__init__.py`, `app/auth/routes.py`, and `app/api/auth.py`.
- [ ] Trigger representative instrumented routes and verify events arrive in PostHog with the intended attribution and non-PII properties; inspect `app/auth/routes.py`, `app/main/routes.py`, and `app/api/tokens.py`.
