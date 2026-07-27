# PostHog setup report

PostHog analytics was added to the Flask microblog with request-scoped identity, 16 guarded product-event capture calls, centralized exception capture, and a starter dashboard.

## Installed and initialized

- Installed the Python `posthog` SDK 7.31.0 (and `backoff` 2.2.1) and declared `posthog` in `requirements.txt`.
- Added environment-backed `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configuration in `config.py`; `.env.example` documents both names, and the configured keys were confirmed present in `.flaskenv`.
- `create_app()` creates one `Posthog` client before blueprint registration, enables exception autocapture, and registers SDK shutdown with `atexit`. Missing configuration is a production no-op and raises in debug/testing so events are not silently disabled.
- Each request opens a fresh PostHog context. Authenticated requests use the stable Flask-Login `User.id`; anonymous requests can inherit incoming PostHog tracing headers and session IDs. Login, registration, and API authentication re-identify after authentication changes.

## Events instrumented

These are planned/instrumented event call sites. The run did **not** exercise the application or observe any event arriving in PostHog, so none are reported as captured.

| Event name | What it measures | File |
|---|---|---|
| `user_logged_in` | Successful web-form sign-in | `app/auth/routes.py` |
| `user_registered` | Successful web-form account creation | `app/auth/routes.py` |
| `user_logged_out` | Authenticated user ending a web session | `app/auth/routes.py` |
| `password_reset_requested` | Password-reset request for an existing account | `app/auth/routes.py` |
| `password_reset_completed` | Successful password change through a reset link | `app/auth/routes.py` |
| `post_created` | Authenticated user publishing a social post | `app/main/routes.py` |
| `profile_updated` | Authenticated user saving profile changes | `app/main/routes.py` |
| `user_followed` | Authenticated user following another account | `app/main/routes.py` |
| `user_unfollowed` | Authenticated user unfollowing another account | `app/main/routes.py` |
| `post_translated` | Authenticated user requesting a post translation | `app/main/routes.py` |
| `message_sent` | Authenticated user sending a direct message | `app/main/routes.py` |
| `post_export_requested` | Authenticated user requesting a post export | `app/main/routes.py` |
| `api_user_registered` | Successful API account creation | `app/api/users.py` |
| `api_profile_updated` | Authenticated API user updating their account | `app/api/users.py` |
| `api_token_created` | Authenticated user creating or retrieving an API token | `app/api/tokens.py` |
| `api_token_revoked` | Authenticated user revoking an API token | `app/api/tokens.py` |

Background export completion remains intentionally uninstrumented because it runs outside an HTTP request; the request event records export initiation. Event properties were kept to safe action metadata, with no PII or user-entered content.

## Identification and error tracking

Identification was wired, not skipped. Request contexts inherit stable authenticated `User.id` values, and successful form/API authentication re-identifies the request context. Person properties such as email and username are sent through identification rather than event properties. No browser SDK or client-side reset behavior was applicable.

The global Flask 500 handler in `app/errors/handlers.py` calls `capture_exception(error)` through the initialized client before returning the existing JSON or HTML response. Exception autocapture is also enabled at initialization. The run did not trigger an exception or observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1913615)

The dashboard contains five tagged insights: a registration-to-first-post funnel, registration trend, content activity trend, community engagement comparison, and account lifecycle trend. It was created from the instrumented event definitions and is expected to be empty until the application emits events; no event volume was verified during this run.

## Verification and unresolved issues

- `pip install -r requirements.txt` completed successfully, with PostHog 7.31.0 resolved.
- Review read-back confirmed the singleton initialization, request identity handling, 16 planned capture calls, and centralized 500 handling.
- No production build, tests, lint, or typecheck were run. No build/typecheck/lint script is defined. Flask CLI verification (`flask --app microblog:app routes`) was attempted but blocked by the runtime command allowlist; therefore compilation/runtime delivery and event flow remain unconfirmed.
- **Follow-up issue — runtime verification:** the Flask application could not be exercised in this run. If left unresolved, deployment could still contain an import, configuration, or request-context problem that prevents events or exceptions from reaching PostHog.
- **Follow-up issue — event delivery:** no event was observed arriving in PostHog. If left unresolved, the dashboard and its insights will remain empty despite the instrumented call sites.

## Before you merge

- [ ] Run a full production build or deployment verification and fix any integration errors introduced by the generated code; inspect `app/__init__.py`, `config.py`, `app/auth/routes.py`, `app/main/routes.py`, `app/api/auth.py`, `app/api/users.py`, `app/api/tokens.py`, and `app/errors/handlers.py`.
- [ ] Run the test suite, including the existing `tests.py`, and update mocks or fixtures for the PostHog client and request context if needed.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only `.flaskenv`; check `config.py` lines 5–6 and 23–24.
- [ ] With the app running, trigger representative authenticated web and API flows and confirm the expected events arrive in PostHog with stable distinct IDs; inspect the capture call sites in `app/auth/routes.py`, `app/main/routes.py`, `app/api/users.py`, and `app/api/tokens.py`.
- [ ] Because authentication and identification were wired, verify a returning authenticated session is identified with the same stable `User.id` rather than fragmented onto an anonymous distinct ID; inspect `app/__init__.py` lines 52–74 and the authentication re-identification paths in `app/auth/routes.py` and `app/api/auth.py`.
- [ ] Trigger a controlled 500 response and confirm exception data arrives in PostHog; inspect `app/errors/handlers.py` lines 18–25.
