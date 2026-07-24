# PostHog setup report

PostHog server-side analytics was added to the FastAPI application with shared initialization, authenticated-user identification, nine product events, exception reporting, and a starter dashboard.

## Installed and initialized

- Added `posthog>=7.29.0` to `requirements.txt`; `pip install -r requirements.txt` completed successfully with PostHog 7.29.0 available.
- Added a process-wide PostHog client in `app/posthog.py`, initialized from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings.
- Wired initialization and shutdown flushing into the FastAPI lifespan in `app/main.py`; exception autocapture is enabled and shutdown is registered for process exit.
- Documented the configuration keys in `.env.example`. The real `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were set in `.env` through the environment tooling.
- No browser SDK or Content-Security-Policy changes were needed because this is a server-only integration.

## Events instrumented

These are the nine events recorded in `.posthog-wizard-cache/.posthog-events.json` and placed after the relevant successful operations, except the intentional insufficient-credit block:

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user successfully signs in. | `app/routers/auth.py` |
| `user_signed_up` | A new account is created through the signup form. | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user signs out. | `app/routers/auth.py` |
| `generation_completed` | AI content generation completes and credits are consumed. | `app/routers/generate.py` |
| `generation_blocked_insufficient_credits` | A generation request is blocked because the account lacks credits. | `app/routers/generate.py` |
| `api_key_created` | An authenticated user creates a programmatic API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes an existing API key. | `app/routers/api_keys.py` |
| `email_updated` | An authenticated user successfully changes the account email address. | `app/routers/settings.py` |
| `password_changed` | An authenticated user successfully changes the account password. | `app/routers/settings.py` |

Event properties were kept operational and non-PII. The email change updates the email as a PostHog person property rather than putting it in event properties.

## User identification

Identification was wired. `app/middleware.py` creates a request-scoped PostHog context for authenticated requests and identifies the user with the stable database user ID. Login and signup also establish a fresh identity context in `app/routers/auth.py`, because the request middleware runs before the new session cookie exists. Normal authenticated captures inherit this context; no per-event distinct-ID placeholders were reported.

This wiring was reviewed, but no application runtime traffic was generated, so arrival and attribution of events in PostHog remain unconfirmed.

## Error tracking

The existing global HTTP 500 handler in `app/main.py` now calls the shared client's `capture_exception` API while preserving existing API and HTML responses. Initialization enables exception autocapture and shutdown flushing. The handoff assumes FastAPI routes uncaught request exceptions through this handler; that runtime behavior was not tested.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902569)

The dashboard contains five insights covering authentication activity, AI generation outcomes, API-key lifecycle, account settings changes, and signup-to-generation conversion. The dashboard and insight definitions were created successfully, but no application traffic was generated, so the tiles may be empty and event ingestion was not verified.

## Verification and unresolved issues

Verified during this run:

- PostHog 7.29.0 installed successfully from `requirements.txt`.
- The changed integration files were reviewed for shared-client initialization, request-scoped identity, guarded captures, person-property updates, and global exception capture.
- Nine planned capture call sites were found across the instrumented routers.
- The dashboard and five insight definitions were created in PostHog.

Not verified during this run:

- No production build, typecheck, lint, test suite, application startup, or runtime request was performed. The project has no defined package manifest, `pyproject.toml`, `setup.cfg`, `tox.ini`, `Makefile`, or explicit build/lint/test command in the repository.
- No event was observed arriving in PostHog. The dashboard is based on the event contract, not observed traffic.
- SDK runtime compatibility of `new_context()` and `identify_context()` was assumed from the framework pattern and was not executed in the application.

No build conflict was reported. The only dependency cleanup was removal of a redundant `posthog>=3.0.0` declaration, retaining `posthog>=7.29.0`.

## Before you merge

- [ ] Run a full production build or equivalent application startup verification and fix any errors introduced by the integration; the run only verified dependency installation and reviewed touched files.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog client, middleware contexts, and capture calls.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are configured in every deployment environment, not only locally; check `app/config.py`, `.env.example`, and deployment configuration.
- [ ] Exercise login, signup, logout, generation success and insufficient-credit paths, API-key creation and revocation, email and password changes, then confirm the nine named events arrive in PostHog with stable authenticated attribution.
- [ ] For authenticated returning sessions, confirm the middleware path in `app/middleware.py` identifies the user before normal route captures run.
