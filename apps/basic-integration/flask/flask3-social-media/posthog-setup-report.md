# PostHog setup report

PostHog analytics, request-scoped user attribution, exception tracking, 15 product events, and a starter dashboard were added to the Flask application.

## What was installed and initialized

- Installed the published Python `posthog` SDK, version 7.32.0, and declared `posthog` in `requirements.txt`.
- `app/__init__.py` creates one instance-based `Posthog` client during `create_app()`, before blueprint registration, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Exception autocapture is enabled, and the client is registered for shutdown at process exit.
- The configured environment variable names are documented in `.env.example`; the real values were configured locally in `.env`.
- Request boundaries create and close PostHog context. Authenticated browser and API users are attributed with the stable `User.id`; incoming browser tracing headers are supported for unauthenticated requests.

## Events instrumented

The run recorded instrumentation for these events. The review verified placement and compilation, but did not observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `post_created` | A signed-in user publishes a post. | `app/main/routes.py` |
| `profile_updated` | A signed-in user saves profile changes. | `app/main/routes.py` |
| `user_followed` | A signed-in user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | A signed-in user unfollows another user. | `app/main/routes.py` |
| `text_translated` | A signed-in user requests a text translation. | `app/main/routes.py` |
| `search_completed` | A signed-in user completes a post search. | `app/main/routes.py` |
| `message_sent` | A signed-in user sends a direct message. | `app/main/routes.py` |
| `post_export_requested` | A signed-in user requests an export of posts. | `app/main/routes.py` |
| `user_logged_in` | A user successfully signs in with the browser form. | `app/auth/routes.py` |
| `user_logged_out` | A signed-in user signs out. | `app/auth/routes.py` |
| `user_registered` | A user successfully creates an account with the browser form. | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a password reset request. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully sets a new password. | `app/auth/routes.py` |
| `api_token_issued` | An authenticated API user issues or reuses an API token. | `app/api/tokens.py` |
| `api_token_revoked` | An authenticated API user revokes an API token. | `app/api/tokens.py` |

The password-reset request is intentionally personless because the flow does not expose whether an account lookup succeeded. Password-reset completion is explicitly attributed to the verified user's stable ID. Event properties were recorded as non-PII metadata; raw post text, message content, usernames, and email addresses were not added to event properties.

## Identification

Identification was wired, not skipped. Request-scoped context identifies authenticated users by `User.id`, and login, registration, and successful API authentication re-identify after the authentication state changes. Email and username are sent as person properties rather than event properties. No runtime delivery or identity attribution was observed during this run, so event flow and resulting distinct IDs remain unconfirmed until the application is exercised.

## Error tracking

`app/errors/handlers.py` now captures the underlying exception in the centralized Flask 500 handler with `current_app.posthog.capture_exception()`, while preserving rollback and response behavior. Handled API `HTTPException` responses remain response-only. The run did not trigger a production exception or observe an error arriving in PostHog.

## Verification and dashboard

- The review installed `requirements.txt` successfully, including `posthog` 7.32.0.
- `compileall` compiled `app`, `config.py`, and `microblog.py` without errors.
- No project build, typecheck, or lint scripts were defined, and no runtime event-delivery test was performed. Compilation proves syntax/import compatibility only; it does not prove that events flow.
- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918785)
- The dashboard contains five wizard-tagged insights: registration trend, publishing trend, engagement actions trend, registration-to-publishing funnel, and authentication activity comparison. Its insights intentionally use the planned event names, even though the run did not verify that the project has observed them.

## Build conflicts

No build conflict was reported. The dependency installation and compilation verification completed successfully. No fixes were required during review.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployed environment, not only the local `.env` file.
2. Exercise registration, login, publishing, engagement, search, messaging, exports, password reset, API token, and logout flows in a deployed or local environment, then confirm the corresponding events appear in the PostHog project.
3. Trigger a controlled 500 error and confirm the exception appears in PostHog Error Tracking with the expected authenticated context where applicable.
4. Review the dashboard after events arrive; until then, its charts may be empty because no event delivery was observed during this run.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; this run verified compilation only (`app`, `config.py`, and `microblog.py`).
- [ ] Run the test suite; the instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in each deployment environment, not just `.env`.
- [ ] Because authentication and identify were wired, verify the returning-visitor path also calls identify so returning sessions do not fragment onto anonymous distinct IDs; inspect `app/__init__.py` request context setup and the authentication refresh paths in `app/auth/routes.py` and `app/api/auth.py`.
- [ ] Exercise the instrumented routes and confirm events and exceptions arrive in PostHog; the run verified code placement and compilation, not delivery.
