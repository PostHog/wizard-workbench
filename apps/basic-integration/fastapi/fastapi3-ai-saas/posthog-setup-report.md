# PostHog setup report

PostHog analytics, request-scoped user identification, custom product events, exception tracking, and a starter dashboard were added to the FastAPI application.

## What was installed and initialized

- Added `posthog>=3.0.0` to `requirements.txt`; the run installed PostHog Python SDK `7.32.0` successfully with pip.
- Added a shared instance-based client in `app/posthog_client.py`, initialized from the optional `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- PostHog initializes in the FastAPI lifespan in `app/main.py`, enables exception autocapture, flushes during application shutdown, and registers shutdown handling with `atexit`.
- Added cached Pydantic Settings configuration in `app/config.py`. The real configuration keys are present in `.env`; values are not embedded in source code.
- `PostHogMiddleware` in `app/middleware.py` creates a request context and identifies authenticated users by their stable database primary-key ID. Login and signup establish identified contexts before the new session cookie is available to middleware.

## Events instrumented

These are the nine events recorded in `.posthog-wizard-cache/.posthog-events.json`:

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user successfully logs in with a password. | `app/routers/auth.py` |
| `user_signed_up` | A new user account is successfully created. | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user logs out. | `app/routers/auth.py` |
| `content_generated` | An AI content generation completes and credits are consumed. | `app/routers/generate.py` |
| `generation_blocked_insufficient_credits` | A generation request cannot proceed because the account lacks credits. | `app/routers/generate.py` |
| `api_key_created` | An authenticated user creates an API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes an API key. | `app/routers/api_keys.py` |
| `email_updated` | An authenticated user successfully changes their account email. | `app/routers/settings.py` |
| `password_changed` | An authenticated user successfully changes their password. | `app/routers/settings.py` |

Captures are guarded when the shared client is unavailable. Event properties do not include email addresses, prompts, API-key names or values, or other user-entered content. Email is set as a person property instead.

## Identification status

User identification is wired, not skipped. Authenticated requests inherit a stable string representation of the user database primary key through `PostHogMiddleware`; login and signup use a fresh identified context. The run did not observe events arriving in PostHog, so event delivery and distinct-ID attribution remain unconfirmed until the application is exercised.

## Error tracking

A global exception handler in `app/main.py` calls the initialized client's `capture_exception` before preserving the existing API/HTML 500 response behavior. SDK exception autocapture is also enabled at client construction. No route-level wrappers were added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918212)

The dashboard contains five tagged insights covering signups/logins, content generation, signup-to-first-generation conversion, API-key lifecycle, and account security changes. The dashboard definitions use the exact event names above, but the run did not observe event data; the insights may remain empty until traffic reaches the application.

## Verified versus unconfirmed

### Verified by this run

- Requirements installation completed successfully, including PostHog SDK `7.32.0`.
- `python3 -m compileall app` completed successfully for every application module after the review fix.
- The integration changes were statically reviewed for environment-backed initialization, request identity contexts, event placement, and non-PII event properties.
- The dashboard and five insights were created successfully in PostHog.

### Not verified by this run

- No application startup, test suite, lint, typecheck, production build, or end-to-end request execution was run.
- No event arrival, exception arrival, or identity attribution was observed in PostHog. A passing compile only proves that the code compiles; it does not prove that events flow.
- No frontend CSP check applies because this is a server-only project with no CSP surface.

## Build conflicts

No unresolved build conflict was reported. During review, one issue was found and fixed: `app/posthog_client.py` now calls `flush()` during lifespan shutdown while retaining the separately registered `atexit` `shutdown()` call, avoiding premature singleton closure. No package manifest build, typecheck, or lint scripts were present, so bytecode compilation was the available build-equivalent verification. Tests were not run.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the run verified compilation only (`app/` and the initialization, middleware, handler, and route files).
- [ ] Run the test suite; instrumented call sites in `app/routers/auth.py`, `app/routers/generate.py`, `app/routers/api_keys.py`, and `app/routers/settings.py` may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only in the local `.env`; review `app/config.py` and the deployment configuration.
- [ ] Exercise login, signup, logout, generation, API-key, and settings flows, then confirm the nine corresponding events and user identities arrive in PostHog; the run did not observe delivery.
- [ ] Trigger an uncaught application exception and confirm error tracking in PostHog; review the handler in `app/main.py`, because the run only verified its static wiring.
- [ ] Verify the returning authenticated-session path identifies the user through `app/middleware.py` so returning sessions do not fragment onto anonymous distinct IDs; this was reviewed but not runtime-tested.
