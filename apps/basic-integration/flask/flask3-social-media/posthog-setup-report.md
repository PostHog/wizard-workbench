# PostHog setup report

PostHog was installed and initialized for the Flask application with request-scoped identity, eleven planned business events, centralized exception capture, and a starter dashboard.

## Verified by this run

### Installation and initialization

- The `posthog` Python package was installed successfully at version `7.33.0` and declared in `requirements.txt`.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were added to `config.py` and documented in `.env.example`; both keys were present in the local `.env` during review.
- A single `posthog.Posthog` client is created in `create_app()` before blueprint registration, with `enable_exception_autocapture=True`, and shut down through `atexit`.
- The shared client is exposed as `app.posthog_client` and is used by later call sites.
- Request contexts identify authenticated users with the stable numeric `User.id`. Login and registration refresh the context after authentication, and email/username are sent as person properties rather than event properties.
- No CSP changes were needed because this is a server-rendered Flask application without a configured CSP.

### Events instrumented

These are instrumented event definitions recorded in `.posthog-wizard-cache/.posthog-events.json`. The run reviewed their successful-action branches, but did not run the application or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user successfully signs in with the web form. | `app/auth/routes.py` |
| `user_registered` | A new user account is created through web registration. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated user signs out. | `app/auth/routes.py` |
| `password_reset_requested` | A visitor submits a password-reset request. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully sets a new password. | `app/auth/routes.py` |
| `post_created` | An authenticated user publishes a post. | `app/main/routes.py` |
| `profile_updated` | An authenticated user saves profile changes. | `app/main/routes.py` |
| `user_followed` | An authenticated user follows another account. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollows another account. | `app/main/routes.py` |
| `message_sent` | An authenticated user sends a direct message. | `app/main/routes.py` |
| `post_export_started` | An authenticated user starts exporting their posts. | `app/main/routes.py` |

### Identification

Identification was wired, not skipped. Authenticated requests use `User.id`; anonymous/server-linked requests may use the tracing distinct-id header. Password-reset requests remain intentionally personless until identity is available. The run reviewed the identity wiring but did not verify attribution on an event observed in PostHog.

### Error tracking

The centralized Flask 500 handler in `app/errors/handlers.py` calls the shared client's `capture_exception(error)`, guarded for the production no-op configuration. Initialization also enables SDK exception autocapture. No route-level exception wrappers were added.

### Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924595) — dashboard `1924595` with four live insight definitions:

- Authentication activity trends
- Content engagement trends
- Account recovery/export trends
- Registration-to-first-post conversion funnel

The dashboard and insights were created successfully, but their data population was not verified because no application traffic was run. One initial content-insight call failed due to a malformed `kind`; it was corrected and recreated successfully.

## Not verified by this run

- No production build, typecheck, lint, or test command was available or run. The reviewer found no repository configuration defining those commands, and tests were intentionally not run.
- No Flask application traffic was generated, so no event capture, delivery, identity attribution, or dashboard data population was observed.
- PostHog SDK call behavior and the uncaught-exception path were reviewed against the installed dependency and framework guidance, but not exercised end to end.
- Installing into the project-local `.venv` succeeded; no lockfile was generated.

## Issues to follow up

- **Runtime delivery remains unresolved:** the run did not establish that any event reaches PostHog. If left unresolved, the dashboard and funnel can remain empty despite the code compiling and the definitions existing.
- **SDK runtime compatibility remains unresolved:** the integration assumes `posthog 7.33.0` exposes `new_context()`, `identify_context()`, and the configured `Posthog` constructor option. If incompatible at runtime, captures and exception tracking may fail.
- **Dashboard URL source limitation:** the dashboard handoff recorded dashboard id `1924595` and successful creation, but did not include a returned URL; the link above uses the configured project and dashboard identifiers.

## Before you merge

- [ ] Run the full production build or application startup check and fix any errors introduced in `app/__init__.py`, `config.py`, `app/auth/routes.py`, `app/main/routes.py`, and `app/errors/handlers.py`.
- [ ] Run the test suite; update mocks or fixtures for the shared `app.posthog_client` and the new capture calls in `app/auth/routes.py` and `app/main/routes.py`.
- [ ] Confirm the exact `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` names documented in `.env.example` are configured in every deployment environment, not only local `.env` (`config.py`, `.env.example`).
- [ ] Exercise representative successful routes and confirm the eleven named events arrive in PostHog with stable user attribution where expected (`app/auth/routes.py`, `app/main/routes.py`).
- [ ] Trigger an uncaught server error and confirm the centralized handler reports it to PostHog Error Tracking (`app/errors/handlers.py`).
- [ ] Open the dashboard and confirm its four insights populate after representative traffic (`Analytics basics (wizard)`, dashboard `1924595`).
- [ ] If auth is used across returning sessions, verify the returning-visitor path continues to call identify so users do not fragment onto anonymous distinct IDs (`app/__init__.py`).
