# PostHog setup report

PostHog analytics, identity context, exception tracking, seven product events, and a starter dashboard were added to the Python meeting summarizer.

## Installed and initialized

- Added the `posthog` Python SDK to `requirements.txt`; review installed PostHog 7.32.0.
- Added `python-dotenv` to load local configuration before SDK initialization.
- `posthog_client.py` loads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment, creates one instance-based `Posthog` client, enables `enable_exception_autocapture=True`, and registers `shutdown()` with `atexit`.
- Missing configuration remains a production no-op and raises the configured development/debug error rather than silently hiding the problem.
- The server imports and reuses this singleton. No browser SDK or CSP changes apply to this server-only integration.

## Events instrumented

These events are planned and instrumented at successful action boundaries in `server.py`. The run did not execute end-to-end requests or observe any event arriving in PostHog, so delivery is **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | An existing user successfully authenticates. | `server.py` |
| `logout_completed` | An authenticated user ends their session. | `server.py` |
| `user_created` | An authenticated user successfully creates a user record. | `server.py` |
| `user_updated` | An authenticated user successfully updates a user record. | `server.py` |
| `user_deleted` | An authenticated user successfully deletes a user record. | `server.py` |
| `meeting_created` | An authenticated user successfully submits a meeting for AI summarization. | `server.py` |
| `meeting_deleted` | An authenticated user successfully deletes one of their meetings. | `server.py` |

Capture properties were reviewed as aggregate or boolean operational metadata; user-entered meeting content and PII were not placed in event properties.

## Identification

Identification was wired. Each HTTP request gets a fresh PostHog context; authenticated requests use `User.user_id` through `identify_context`, and login re-identifies the newly authenticated user. Login also sets email, full name, and username as person properties via `set`, rather than putting them on events. The run did not perform live requests, so the resulting identity association is implementation-verified but runtime-unconfirmed.

## Error tracking

`enable_exception_autocapture=True` is enabled on the singleton. A focused `SaaSHTTPServer.handle_error` boundary calls `posthog_client.capture_exception()` for uncaught request-level exceptions and logs the traceback. The review corrected the hook placement because global dispatch belongs on the HTTP server subclass. Handled exceptions converted to 500 responses inside existing request methods were not individually wrapped.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918326) contains four saved insights: authentication activity, user management activity, meeting activity, and a login-to-meeting conversion funnel. The dashboard was created successfully, but is expected to remain empty until events are generated; no event data was observed during this run.

## Verification and unresolved items

- Verified: dependencies installed successfully; `python3 -m compileall server.py posthog_client.py` completed successfully; the review found and fixed the ineffective error-hook placement and missing `.env` loading.
- Not verified: a production build, automated tests, application startup, live HTTP actions, event delivery, person identification in received events, or dashboard population. No build, typecheck, or lint scripts are defined in this plain Python project.
- Build conflict: none reported. The only review changes were the error-hook dispatch correction and `.env` loading correction; both were resolved.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only the local `.env`; use `.env.example` for the exact names.
2. Exercise login, logout, user-management, and meeting paths in a running environment and confirm all seven event names arrive in PostHog with the expected authenticated distinct IDs.
3. Trigger an uncaught request exception and confirm it appears in PostHog error tracking.
4. Run the dashboard after traffic arrives and validate the four insights and funnel against expected application behavior.

## Before you merge

- [ ] Run the full production/build or deployment validation for this Python application and fix any integration errors; the wizard only compiled `server.py` and `posthog_client.py` (`server.py`, `posthog_client.py`).
- [ ] Run the test suite and update mocks or fixtures for the new PostHog initialization, request context, captures, and error boundary (`server.py`, `posthog_client.py`).
- [ ] Confirm the exact environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` shown in `.env.example` are configured in deployment environments, not just local `.env` (`.env.example`, `posthog_client.py`).
- [ ] Because authentication and identification were wired, verify the returning authenticated-request path continues to call `identify_context` so sessions do not fragment onto anonymous IDs (`server.py`).
