# PostHog setup report

PostHog analytics was installed and initialized for the FastAPI application, with authenticated request identity, nine server-side events, automatic exception tracking, and a starter dashboard.

## Installed and initialized

- Added `posthog>=7.31.0` to `requirements.txt`; the review step installed the complete manifest successfully.
- Added optional PostHog settings in `app/config.py` and documented `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env.example`.
- Configured the real environment values in `.env` using the wizard tools; key presence was verified, but values were not exposed in the run.
- Created the shared client in `app/posthog_client.py` using the SDK `Posthog()` instance, environment-based configuration, exception autocapture, debug-time missing-key errors, shutdown flushing, and `atexit` shutdown registration.
- `app/main.py` initializes and shuts down the client through the FastAPI lifespan.

The dependency installation and code review passed. No application startup, production build, lint, typecheck, test suite, or live event-delivery check was run. Therefore, the run does **not** confirm that events have arrived in PostHog.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user successfully signs in with a password. | `app/routers/auth.py` |
| `user_signed_up` | A new user account is successfully created. | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user ends their session. | `app/routers/auth.py` |
| `api_key_created` | An authenticated user creates an API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes an API key. | `app/routers/api_keys.py` |
| `content_generated` | An AI content generation completes and credits are consumed. | `app/routers/generate.py` |
| `content_generation_blocked` | An AI generation is blocked because the user lacks credits. | `app/routers/generate.py` |
| `email_updated` | An authenticated user successfully changes their account email. | `app/routers/settings.py` |
| `password_changed` | An authenticated user successfully changes their password. | `app/routers/settings.py` |

The event plan and review confirmed lower_snake_case names and no PII in event properties. Email is set as a person property rather than sent as an event property.

## User identification

Identification is wired. `PostHogRequestContextMiddleware` opens a context for each HTTP request, resolves the signed session cookie, and identifies authenticated users with the stable database user ID (`str(user.id)`). Login and signup create a fresh identified context after authentication succeeds because their response cookie is not available to the original request middleware. Unauthenticated requests remain anonymous.

## Error tracking

The global HTTP middleware wraps requests in the PostHog context API, while the SDK's `new_context()` exception autocapture handles uncaught request exceptions. No manual exception capture wrappers were added. This behavior was reviewed in code but not exercised at runtime.

## Dashboard

[Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1914240)

The dashboard contains four tagged views: Authentication activity, Signup to content generation funnel, Content generation outcomes, and API key lifecycle. The dashboard intentionally starts empty until matching events arrive.

## Build conflicts and unresolved issues

- No build, typecheck, or lint configuration was found, so those checks were not available to run.
- No tests were run.
- Production event delivery was not exercised; event arrival, dashboard population, and exception delivery remain unconfirmed.
- One parallel insight creation initially timed out. The API key lifecycle insight was retried successfully, and no duplicate appeared in the returned results.
- No stable-ID placeholder or unresolved attribution issue was reported by the run.

## Before you merge

- [ ] Run the full production build (or the deployment build for this FastAPI service) and fix any errors introduced by the integration; review `app/main.py`, `app/posthog_client.py`, and `app/middleware.py`.
- [ ] Run the test suite, including authentication, API-key, generation, and settings coverage; update mocks or fixtures for captures in `app/routers/auth.py`, `app/routers/api_keys.py`, `app/routers/generate.py`, and `app/routers/settings.py`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; use `.env.example` as the variable-name reference.
- [ ] Exercise login, signup, logout, API-key, generation, email, and password flows in a deployed or local environment and confirm the nine planned events arrive in PostHog; the run itself did not observe delivery.
- [ ] For an authenticated returning session, verify events retain the database user ID through `app/middleware.py` and that login/signup establish identity as intended in `app/routers/auth.py`.
