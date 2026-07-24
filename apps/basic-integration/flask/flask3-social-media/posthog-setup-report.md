# PostHog setup report

## Summary

This run added the PostHog Python SDK to the Flask application, initialized a request-aware server-side client, identified authenticated users, instrumented ten social-media events, added global 500-error capture, and created a starter dashboard.

## What was installed and initialized

- Added the `posthog` dependency to `requirements.txt`; dependency installation completed successfully with PostHog SDK version 7.29.0.
- Added optional `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configuration in `config.py`, documented the keys in `.env.example`, and configured the real values in the local `.env` during the run.
- `create_app()` constructs one instance-based `Posthog` client before blueprint registration, enables `enable_exception_autocapture=True`, and registers SDK shutdown with `atexit`.
- Missing configuration fails loudly in debug/development and leaves production as a no-op, so production boot is not broken by absent analytics configuration.
- Each request opens and closes a fresh PostHog context. Authenticated users are identified using their stable database primary key; email and username are sent as person properties rather than event properties.

## Instrumented events

The event plan records these ten events. The run verified matching capture call sites by reading the changed application files; it did **not** execute requests or observe any event arrive in PostHog.

| Event | Measures | File |
|---|---|---|
| `user_logged_in` | A user successfully signs in with the web form. | `app/auth/routes.py` |
| `user_registered` | A new account is created through the web registration form. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated user signs out. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully completes a password reset. | `app/auth/routes.py` |
| `post_created` | An authenticated user publishes a post. | `app/main/routes.py` |
| `profile_updated` | An authenticated user saves profile changes. | `app/main/routes.py` |
| `user_followed` | An authenticated user follows another account. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollows another account. | `app/main/routes.py` |
| `message_sent` | An authenticated user sends a direct message. | `app/main/routes.py` |
| `posts_export_requested` | An authenticated user starts an export of their posts. | `app/main/routes.py` |

Event properties are limited to non-PII metadata, including remembered-login status, language-detected presence, profile-field state, and message length. Export completion remains uninstrumented because it runs outside request context; only export initiation is tracked. API token and user-management endpoints were not included in this pass.

## Identification

Identification was wired, not skipped. Request contexts identify authenticated users by stable user ID. Form login and registration explicitly establish identity, and API basic/token authentication does the same. Password-reset completion identifies the verified user before capture because that route begins unauthenticated. Email and username are person properties. Background jobs and scripts have no request context and must provide their own stable identity if they are instrumented later.

## Error tracking

The existing global Flask 500 handler now calls `current_app.posthog_client.capture_exception(error)` when the client is configured. SDK exception autocapture is also enabled during initialization. The run verified the code path by review, but did not trigger an application error or observe an exception in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901729) contains five saved insights covering registration-to-login conversion, authentication, content creation, social engagement, and account maintenance. PostHog returned the dashboard and five attached tiles successfully. The dashboard may initially be empty because no runtime events were emitted during this run; event delivery remains unconfirmed.

## Verified versus unconfirmed

### Verified by this run

- Dependency installation and requirements declaration succeeded.
- Configuration, client initialization, request identity handling, ten capture call sites, and centralized exception capture were reviewed.
- PostHog returned the dashboard and five insight tiles successfully.
- No unrelated integration defects were found in review, and no application CSP was present.

### Not verified by this run

- No Flask request was executed.
- No event was observed arriving in PostHog.
- No exception was triggered and no error event was observed in PostHog.
- No production build, lint, typecheck, or test suite was run.

## Build conflict

No build, lint, or typecheck command exists in this Python project. A Python compile command was attempted but the permitted runtime disallowed it, so compile verification could not be completed. Dependency installation was the only executable verification available. No code conflict or integration defect was found during review.

## Before you merge

- [ ] Run the full production/startup validation for the deployment environment and fix any lint, type, import, or runtime errors introduced by the integration; inspect `app/__init__.py:54-86` and the changed capture handlers in `app/auth/routes.py:12-25` and `app/main/routes.py:12-18`.
- [ ] Run the test suite and update any mocks or fixtures that cover the changed request lifecycle, authentication, routes, or error handler; inspect `app/__init__.py:72-86`, `app/auth/routes.py`, `app/main/routes.py`, and `app/errors/handlers.py:14-26`.
- [ ] Confirm the exact environment variable names `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; inspect `.env.example:1-2`, `config.py:25-26`, and the deployment configuration.
- [ ] With auth enabled, exercise a returning authenticated session and confirm it remains associated with the stable user ID rather than fragmenting onto an anonymous ID; inspect `app/__init__.py:72-78` and the login/API authentication callers.
- [ ] Exercise representative instrumented routes and verify the ten named events arrive in PostHog and populate the dashboard; inspect the call sites listed in the event table above.
- [ ] Trigger a controlled 500 error and verify the exception appears in PostHog; inspect `app/errors/handlers.py:14-26`.
