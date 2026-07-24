# PostHog setup report

PostHog analytics was added to the Flask application with the Python SDK, request-scoped identity, 15 planned product/API events, centralized exception capture, and a starter dashboard.

## Installed and initialized

- Installed the `posthog` Python package, version 7.29.0, and declared it in `requirements.txt`.
- Added environment-backed configuration in `config.py` and documented the keys in `.env.example`; the real values were configured locally through the wizard environment tooling.
- Initialized one `posthog.Posthog` instance in `create_app()` before blueprint registration, using the configured project key and host. Exception autocapture is enabled, shutdown is registered with `atexit`, and the singleton is exposed as `app.posthog` for route handlers.
- Missing configuration is a production no-op but raises the configured runtime error in debug/testing mode.

## Events instrumented

The following capture calls were added. The run verified that the planned event file contains these 15 events and that repository review found 15 corresponding capture calls. The run did **not** execute the application or observe any event arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Successful web-form sign-in | `app/auth/routes.py` |
| `user_logged_out` | Authenticated user sign-out | `app/auth/routes.py` |
| `user_registered` | New account created through web registration | `app/auth/routes.py` |
| `password_reset_requested` | Password-reset instructions requested | `app/auth/routes.py` |
| `password_reset_completed` | Password successfully changed through a valid reset link | `app/auth/routes.py` |
| `post_created` | Authenticated user publishes a post | `app/main/routes.py` |
| `profile_updated` | Authenticated user saves profile changes | `app/main/routes.py` |
| `user_followed` | Authenticated user follows another account | `app/main/routes.py` |
| `user_unfollowed` | Authenticated user unfollows another account | `app/main/routes.py` |
| `message_sent` | Authenticated user sends a direct message | `app/main/routes.py` |
| `posts_export_requested` | Authenticated user starts a post export | `app/main/routes.py` |
| `api_token_created` | API client obtains an authentication token | `app/api/tokens.py` |
| `api_token_revoked` | Authenticated API client revokes its token | `app/api/tokens.py` |
| `api_user_registered` | New account created through the API | `app/api/users.py` |
| `api_profile_updated` | Authenticated API client updates its profile | `app/api/users.py` |

## User identification

Identification was wired, not skipped. Each request establishes a PostHog context using the authenticated Flask-Login user ID or the incoming `X-POSTHOG-DISTINCT-ID` header. Web login and registration, and successful API authentication, refresh the context with the database user ID. Email and username are sent only as person properties, not event properties. Returning-session behavior was reviewed but not exercised at runtime, so actual attribution in delivered events is unconfirmed.

## Error tracking

The centralized 500 error handler in `app/errors/handlers.py` calls `current_app.posthog.capture_exception(error)` when the configured client is available. Expected 404 responses are not captured. The run did not execute the application or observe an exception in PostHog, so delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902581)

The dashboard has five wizard-tagged insights covering registration-to-first-post conversion, core engagement, authentication activity, content lifecycle/exports, and API account activity. They use the exact planned event names over a 30-day range and may remain empty until application traffic arrives.

## Verification and unresolved items

- Dependency installation completed successfully, including PostHog 7.29.0.
- Review found zero fixes required and confirmed the intended files and event plan are internally consistent.
- No build, typecheck, or lint command is defined by project metadata. Tests were not run, and the application was not started. Therefore compilation, startup, SDK compatibility at runtime, event delivery, exception delivery, and dashboard population were not verified.
- No Content-Security-Policy was found in the inspected project, so no CSP change was required.
- Build conflict: one initial parallel insight-creation batch had malformed JSON; it was corrected, and all five insight creations succeeded. No application build conflict was reported.

## Next steps

1. Configure `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` from `.env.example` in every deployment environment, not only the local `.env`.
2. Run the application and exercise login, registration, posting, profile, social, messaging, export, password-reset, and API flows; confirm the corresponding events arrive in PostHog with stable distinct IDs.
3. Trigger a controlled 500 error and confirm it appears in PostHog Error Tracking.
4. Run the project’s test suite and any production build or deployment checks available in the deployment environment.
5. Review the dashboard after real traffic arrives and adjust insight filters or date ranges if needed.

## Before you merge

- [ ] Run a full production/deployment build or startup verification and fix any errors introduced by the integration; no build command was defined or run by the wizard. Check `app/__init__.py`, `config.py`, and `requirements.txt`.
- [ ] Run the test suite and update any mocks or fixtures affected by PostHog initialization, request contexts, captures, or error handling. Check `app/__init__.py`, `app/auth/routes.py`, `app/main/routes.py`, `app/api/auth.py`, `app/api/tokens.py`, `app/api/users.py`, and `app/errors/handlers.py`.
- [ ] Set the exact environment variables documented in `.env.example` (`POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST`) in each deployment environment. Check `.env.example` and `config.py`.
- [ ] Because authentication identification is wired, exercise a returning authenticated visitor and confirm the request context continues to use the stable database user ID. Check `app/__init__.py` and `app/api/auth.py`.
