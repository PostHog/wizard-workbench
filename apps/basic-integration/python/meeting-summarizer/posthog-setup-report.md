# PostHog setup report

PostHog analytics was added to the pure-Python meeting summarizer with shared request-scoped identity, eight server events, uncaught-exception tracking, and a starter dashboard.

## Installed and initialized

- Added the `posthog` Python SDK (7.29.0 was installed) to `requirements.txt`.
- Added `python-dotenv` to `requirements.txt` and load the project `.env` before configuration.
- `posthog_client.py` creates one instance-based `Posthog` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, registers shutdown with `atexit`, and enables `enable_exception_autocapture=True`.
- Missing configuration is handled as a production no-op and produces development errors, according to the recorded initialization handoff.
- The real configured environment values were written to `.env` through wizard environment tooling; `.env.example` documents the required key names.

## Events instrumented

The following eight events are implemented in `server.py` and recorded in `.posthog-wizard-cache/.posthog-events.json`:

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | An existing active account completes authentication. | `server.py` |
| `login_failed` | An authentication attempt is rejected. | `server.py` |
| `logout_completed` | An authenticated user ends their session. | `server.py` |
| `user_created` | An authenticated user creates another user account. | `server.py` |
| `meeting_created` | An authenticated user creates a meeting and receives an AI summary. | `server.py` |
| `user_updated` | An authenticated user updates a user record. | `server.py` |
| `user_deleted` | An authenticated user permanently deletes a user account. | `server.py` |
| `meeting_deleted` | An authenticated user permanently deletes one of their meetings. | `server.py` |

Event properties are aggregate metadata such as booleans, counts, transcript length, and duration. The capture handoff reports that user-entered content and PII were excluded.

**Important verification boundary:** no runtime execution was performed, and the run did not observe events arriving in PostHog. The event list above describes instrumented call sites, not confirmed ingestion.

## User identification

Identification was wired. Each HTTP method handler runs inside a fresh `posthog_client.new_context()`; authenticated requests call `identify_context(user.user_id)` using the stable database user ID. Successful login re-identifies after authentication and stores email and username on the person profile via `posthog_client.set`, rather than putting them in event properties. Failed login remains intentionally personless because no authenticated identity exists.

## Error tracking

Uncaught exception tracking is enabled globally through `enable_exception_autocapture=True` in `posthog_client.py`, with the existing `atexit` shutdown registration preserved. No additional manual handled-error capture was added. The run did not execute a failure scenario or observe an exception in PostHog, so delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902673)

The dashboard contains four tagged insights covering authentication activity, meeting creation, meeting lifecycle, and the login-to-meeting funnel. The dashboard and insights were created successfully through PostHog MCP, but may initially be empty because event delivery was not observed.

## Build status and conflicts

The dependency installation and review checks completed successfully: `pip install -r requirements.txt` completed twice, including `posthog 7.29.0` and `python-dotenv 1.2.2`. No separate build, typecheck, or lint command exists in this pure-Python project, so none was run. No build conflict was reported. This verifies dependency installation and review only; it does not prove the application builds or that events flow.

## Issues to follow up

- **Runtime ingestion is unresolved:** no run step exercised the application and confirmed events arriving in PostHog. If left unresolved, the dashboard and event analyses may remain empty even though the call sites compile and were reviewed.
- **Exception delivery is unresolved:** exception autocapture was configured but not exercised. If left unresolved, uncaught failures could remain absent from PostHog despite the enabled setting.
- **Production build/tooling status is unresolved:** no project-specific build, typecheck, or lint command was available. If left unresolved, integration defects could remain undetected until deployment.

## Next steps

1. Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only the local `.env`; the required names are documented in `.env.example`.
2. Run the full production build and test suite, then fix any integration errors or updated mocks/fixtures.
3. Exercise login success/failure, logout, user CRUD, and meeting create/delete paths in a safe environment.
4. Confirm the corresponding events arrive in PostHog with stable authenticated attribution, and confirm an uncaught test exception appears in error tracking.
5. Open the dashboard and validate that its four insights populate with the observed events.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the review step did not have a project-specific build command. Check `posthog_client.py` and `server.py`.
- [ ] Run the test suite and update any mocks or fixtures affected by instrumentation; check the event call sites in `server.py`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in deployment environments, not just locally; check `.env.example` and deployment/bootstrap configuration.
- [ ] Because authentication uses identify, verify the returning authenticated-request path still calls `identify_context` so users do not fragment onto anonymous IDs; check `server.py:124` and the login re-identification around `server.py:302`.
