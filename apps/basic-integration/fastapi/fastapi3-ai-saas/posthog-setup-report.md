# PostHog setup report

PostHog was added to the FastAPI application with request-scoped identity, eight product events, exception autocapture, and a starter dashboard.

## What was installed and initialized

- Added the `posthog` Python SDK, version declaration `posthog>=7.32.0`, to `requirements.txt`.
- Configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the local environment; both keys were confirmed present without exposing their values. `.env.example` documents the configuration names with placeholders.
- `app/main.py` creates one `Posthog` client during the FastAPI lifespan, enables `enable_exception_autocapture=True`, and shuts it down during lifespan shutdown and process exit.
- Missing configuration is handled according to the application’s debug/production behavior: debug fails loudly, while production remains a no-op.
- Authenticated HTTP requests receive a PostHog context through `app/middleware.py`, using the stable database user ID as the distinct ID. Login and signup create fresh identified contexts.

## Instrumented events

The run recorded these eight planned events. The code review confirmed capture call sites, but no runtime delivery to PostHog was observed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An existing user successfully authenticates with the password form. | `app/routers/auth.py` |
| `user_signed_up` | A new account is created through the signup form. | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user ends their server session. | `app/routers/auth.py` |
| `api_key_created` | An authenticated user creates a programmatic API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes one of their API keys. | `app/routers/api_keys.py` |
| `content_generated` | An authenticated user completes AI content generation and spends credits. | `app/routers/generate.py` |
| `email_updated` | An authenticated user successfully changes the email on their account. | `app/routers/settings.py` |
| `password_changed` | An authenticated user successfully changes their password. | `app/routers/settings.py` |

Event properties were limited to safe metadata such as signup method, generation type, credit quantities, prompt length, and active-key count. No emails, API keys, prompts, generated content, or passwords were placed in event properties.

## User identification

Identification was wired, not skipped. Authenticated request contexts use `str(current_user.id)` as the stable distinct ID. Login and signup explicitly establish a fresh identified context after successful authentication; returning authenticated requests are identified by middleware. Email, credits, and active-status values are person properties rather than event properties.

## Error tracking

No additional error-tracking file changes were needed. The initialized client uses `enable_exception_autocapture=True`, which the error-tracking step identified as the SDK’s global uncaught-exception mechanism. Runtime exception delivery was not exercised, so PostHog receipt of an error event remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918781)

The dashboard contains five tagged insights covering authentication activity, content generation volume, API key activity, account security changes, and the generation activation funnel. The dashboard definitions are ready, but may be empty until events arrive; the run did not observe events populating them.

## What the run verified

- `pip install posthog` completed successfully with `posthog-7.32.0`.
- `requirements.txt` declares the SDK.
- `.venv/bin/python3 -m compileall app` passed before and after the review change.
- Review found no additional defects, and no build, typecheck, or lint scripts were present in the project manifests.
- The local environment contains both required PostHog keys.
- Dashboard creation and all five insight creations succeeded.

## What the run did not verify

- No application runtime test was available or run.
- No event was observed arriving in PostHog.
- Exception autocapture was not runtime-tested.
- No production build, test suite, lint, or typecheck was available beyond Python bytecode compilation.

## Build conflicts

No unresolved build conflict was reported. The dashboard step initially encountered malformed JSON in parallel insight calls due to command quoting; corrected calls succeeded, and no duplicate failed insights were created. The review step reported no remaining conflict.

## Before you merge

- [ ] Run the full production/deployment build and fix any lint or type errors introduced by the integration; the run only verified `compileall` for `app`.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog client, middleware, and capture call sites.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in every deployment environment, not only in the local `.env`; see `.env.example` and `app/config.py`.
- [ ] Exercise login, signup, logout, API-key mutations, generation, and account-security mutations in a running environment, then confirm the corresponding events arrive in PostHog with stable user attribution.
- [ ] Trigger an unhandled exception in a running environment and confirm exception data arrives in PostHog.
- [ ] If authenticated sessions can return through a path that bypasses the middleware, inspect `app/middleware.py` and `app/main.py` to ensure the returning request still calls identification before merging.
