# PostHog setup report

PostHog server-side analytics was added to the FastAPI application with request-level user identity, nine product events, exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed the Python PostHog SDK version 7.32.0 and declared `posthog>=7.32.0` in `requirements.txt`.
- Added optional `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings in `app/config.py`, documented them in `.env.example`, and configured the real values in the local `.env` through the environment tooling.
- Initialized one instance-based `posthog.Posthog` client during the FastAPI lifespan in `app/main.py`, stored it on `app.state.posthog`, enabled `enable_exception_autocapture=True`, registered shutdown with `atexit`, flushed before lifespan shutdown, and shut it down during lifespan teardown.
- Authenticated requests use `PostHogContextMiddleware` and the stable database user ID. Login and signup establish a fresh identified context after authentication succeeds; email is stored as a person property rather than an event property.

## Events instrumented

These are instrumented call sites planned by the run. The run did **not** exercise the application against PostHog, so arrival of any event was not verified.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Successful submission of valid login credentials | `app/routers/auth.py` |
| `user_signed_up` | Creation of a new user account through signup | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user ending their session | `app/routers/auth.py` |
| `api_key_created` | Creation of a programmatic API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Revocation of an API key | `app/routers/api_keys.py` |
| `generation_completed` | Completion of AI content generation and credit consumption | `app/routers/generate.py` |
| `generation_blocked_insufficient_credits` | AI generation blocked because the account lacks credits | `app/routers/generate.py` |
| `email_updated` | Successful account email update | `app/routers/settings.py` |
| `password_changed` | Successful password change | `app/routers/settings.py` |

Generation event metadata is limited to generation type, credit counts, and prompt length. No PII is included in event properties.

## Identification and error tracking

User identification was wired, not skipped. Normal authenticated requests identify users with `str(user.id)` through request context middleware, and login/signup refresh identity after authentication. No browser SDK is present.

Error tracking was already covered by the single SDK initialization: `enable_exception_autocapture=True` in `app/main.py`. No route-level exception wrappers or duplicate manual exception captures were added. The run verified the configuration by source review, but did not trigger an exception and did not observe an exception event arriving in PostHog.

## Verification and limits

- `pip3 install -r requirements.txt` completed successfully with PostHog 7.32.0.
- `python3 -m compileall app` passed, including the instrumented routers.
- The run found no package-manager lockfile or build/lint script, so compilation was the available build-equivalent check.
- Environment key presence was verified, but secret values were not exposed in the run.
- Event delivery, dashboard data population, production startup, tests, and a full production build were not verified.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919720)

The dashboard contains four insights: Signup funnel, Authentication activity, AI generations completed, and Generation credit blocks. It was created from the instrumented event names; it may remain empty until the application emits events.

## Build conflicts

No build conflict was reported. The review removed a redundant `posthog>=3.0.0` declaration from `requirements.txt` and retained `posthog>=7.32.0`. No other conflict was recorded.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the run only verified `python3 -m compileall app`.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented route calls.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` in every deploy environment, not only the local `.env`; review `app/config.py` and `app/main.py`.
- [ ] Exercise login, signup, logout, API-key, generation, and settings flows, then confirm the nine named events arrive in PostHog with stable user identity; inspect the capture call sites in `app/routers/auth.py`, `app/routers/api_keys.py`, `app/routers/generate.py`, and `app/routers/settings.py`.
- [ ] Trigger a representative uncaught exception and confirm exception autocapture arrives; inspect `app/main.py`.
- [ ] If authentication supports returning sessions outside the tested request path, verify that the returning-user path still calls identification; inspect `app/middleware.py` and `app/main.py`.

## Follow-up issue

The run did not establish runtime event attribution or delivery. Leaving this unresolved means the dashboard can remain empty and events may not be usable for product analysis even though the code compiles. Confirm delivery and stable distinct IDs by exercising the flows listed in the merge checklist.
