# PostHog setup report

PostHog analytics was added to the FastAPI application with environment-backed initialization, request-scoped user attribution, nine server-side events, exception autocapture, and a starter dashboard.

## Installed and initialized

- Added the Python `posthog` SDK at `posthog>=7.33.0` in `requirements.txt`; the review installed the requirements successfully and resolved PostHog 7.33.0.
- Added cached Pydantic Settings configuration in `app/config.py`.
- Initialized one process-wide `Posthog` client during the FastAPI lifespan in `app/main.py`, using environment-backed project token and host settings.
- Configured `enable_exception_autocapture=True`, registered shutdown handling with `atexit`, and flushes/shuts down the client during lifespan shutdown.
- Documented `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env.example`; the real values were configured in `.env` during the run.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Authenticated user successfully signs in with a password. | `app/routers/auth.py` |
| `user_signed_up` | New account is successfully created through the signup form. | `app/routers/auth.py` |
| `user_logged_out` | Authenticated user explicitly signs out. | `app/routers/auth.py` |
| `content_generated` | AI content generation completes and credits are deducted. | `app/routers/generate.py` |
| `generation_blocked_insufficient_credits` | A generation request is blocked because the account lacks credits. | `app/routers/generate.py` |
| `api_key_created` | Authenticated user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | Authenticated user revokes one of their API keys. | `app/routers/api_keys.py` |
| `email_updated` | Authenticated user successfully updates their account email. | `app/routers/settings.py` |
| `password_changed` | Authenticated user successfully changes their password. | `app/routers/settings.py` |

The event plan records all nine events. Event properties were kept to operational metadata; prompts, generated content, API-key material, and user-entered names were not sent as event properties.

## Identification

User identification was wired. `PostHogMiddleware` creates a request-scoped context and identifies authenticated users with the stable database identifier `str(User.id)`. Login and signup create fresh identified contexts because the session cookie does not exist until authentication succeeds. Email is sent as a person property through `Posthog.set`, not as an event property. No placeholder distinct IDs were reported.

The run did not exercise a live authenticated request, so it verified the attribution code and compilation—not that identified events arrived in PostHog.

## Error tracking

Uncaught exception tracking is configured through `enable_exception_autocapture=True` on the shared client in `app/main.py`. No additional route-level exception wrappers were added. The review also confirmed the client lifecycle flush and shutdown behavior.

This configuration was not runtime-tested during the run, so arrival of exception events remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926569)

The dashboard contains five tagged `(wizard)` insights covering the signup-to-content-generation funnel, authentication activity, generation outcomes, API-key lifecycle, and account-security updates. The definitions use the captured event names and a 30-day range. The dashboard exists in PostHog; the run did not verify that it contains ingested event data.

## Verification and unresolved items

Verified during the run:

- `requirements.txt` installation completed successfully with PostHog 7.33.0.
- `.venv/bin/python -m compileall app` completed successfully.
- The review found no project build, lint, typecheck, or test scripts beyond compilation.
- The dashboard and five insights were created successfully in project 483112.
- The integration preserves stable user attribution in the middleware and authentication flows.

Not verified during the run:

- No application runtime request was exercised.
- No event or exception was observed arriving in PostHog.
- No full production build, test suite, lint run, or typecheck was available or run.
- Dashboard tiles may initially show no data until the application emits events.

No build conflict was reported. The only review correction was removal of the duplicate weaker `posthog>=3.0.0` declaration, retaining `posthog>=7.33.0`; the supported context identification API was also corrected before compilation.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; keep the names documented in `.env.example`.
2. Run the application through signup, login, logout, generation success, insufficient-credit blocking, API-key creation/revocation, email update, and password change paths.
3. Confirm the nine corresponding events and at least one exception arrive in PostHog with the expected stable user attribution.
4. Open the dashboard and confirm its five insights populate after test traffic.

## Before you merge

- [ ] Run the full production/build verification available for this deployment and fix any errors introduced by the integration; the run only verified `app` compilation (`app/main.py` lifespan setup and `app/middleware.py` request context are key areas to inspect).
- [ ] Run the test suite and update any mocks or fixtures for the instrumented routes (`app/routers/auth.py`, `app/routers/generate.py`, `app/routers/api_keys.py`, and `app/routers/settings.py`).
- [ ] Confirm the exact environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in each deployment environment (`app/config.py` and `app/main.py`).
- [ ] Exercise the instrumented authenticated paths and confirm events arrive in PostHog (`app/routers/auth.py`, `app/routers/generate.py`, `app/routers/api_keys.py`, and `app/routers/settings.py`).
- [ ] If authentication remains enabled, verify a returning authenticated session is identified through the middleware (`app/middleware.py`) rather than fragmented onto an anonymous distinct ID.
