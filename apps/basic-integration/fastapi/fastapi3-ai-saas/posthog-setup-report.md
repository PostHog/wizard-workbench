# PostHog setup report

PostHog was added to the FastAPI application with environment-backed initialization, authenticated-user attribution, nine server-side product events, exception autocapture, and a starter dashboard.

## Installed and initialized

- Added `posthog>=7.33.0` to `requirements.txt`; `pip3 install -r requirements.txt` completed successfully with PostHog 7.33.0 resolved.
- `app/main.py` creates one shared `Posthog` client during the FastAPI lifespan using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enable_exception_autocapture=True`, registers shutdown, and flushes on lifespan teardown.
- `app/config.py` reads the optional PostHog settings. `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the real values were confirmed present in local `.env` by the initialization step.
- If configuration is absent, debug mode fails loudly; production remains a no-op rather than sending events without a key.

## Events instrumented

These are instrumented call sites planned by the run. The run did **not** observe events arriving in PostHog, so “instrumented” does not mean “captured and verified.”

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | Successful password sign-in | `app/routers/auth.py` |
| `user_signed_up` | New account created through signup | `app/routers/auth.py` |
| `user_logged_out` | Authenticated user ends a session | `app/routers/auth.py` |
| `content_generation_completed` | AI generation succeeds and credits are deducted | `app/routers/generate.py` |
| `content_generation_blocked_insufficient_credits` | Generation blocked because the account lacks credits | `app/routers/generate.py` |
| `api_key_created` | Authenticated user creates an API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Authenticated user revokes an API key | `app/routers/api_keys.py` |
| `account_email_updated` | Authenticated user successfully changes account email | `app/routers/settings.py` |
| `password_changed` | Authenticated user successfully changes password | `app/routers/settings.py` |

Event properties were kept metadata-only; the capture handoff reports that prompts, generated content, API-key names/material, email addresses, and passwords are excluded from event properties.

## Identification and attribution

Identification was wired, not skipped. `app/middleware.py` opens an instance-scoped PostHog context for authenticated HTTP requests and identifies users with `str(User.id)`. Email and account status are sent as person properties, not event properties. Login and signup establish fresh identified contexts after authentication changes in `app/routers/auth.py`. Logout deletes the session cookie; no separate anonymous reset was added because the backend has no additional logout state.

The stable identity and request context behavior were reviewed, but actual attribution of an event in PostHog was not observed during this run.

## Error tracking

Unhandled exception tracking is configured through the shared client in `app/main.py` with `enable_exception_autocapture=True`. No additional wrappers or exception handlers were added, avoiding duplicate capture. Existing 404/500 response handlers were left unchanged.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924596)

The dashboard contains five tagged insights covering authentication activity, AI generations, generation outcomes, signup-to-generation conversion, and API-key lifecycle. The definitions were created successfully, but the dashboard handoff explicitly notes that events may not have arrived yet.

## Verification and unresolved issues

- Verified: dependency installation completed successfully.
- Verified: `python3 -m compileall app` completed successfully.
- Verified: PostHog dashboard and five insights were created in project 483112.
- Not verified: end-to-end delivery, event ingestion, exception arrival, or dashboard population. The review handoff explicitly says delivery could not be exercised.
- Not verified: the full test suite, linting, type checking, or a production build. No project-defined commands for those checks were found by review.

**Follow-up issue — event delivery remains unresolved.** No run step observed an event arrive in PostHog. If left unresolved, the dashboard and the nine instrumented actions can remain empty even though the application compiles. Exercise login, signup, generation success/credit blocking, API-key changes, settings changes, and logout in a configured deployment, then confirm their events and the authenticated distinct ID in PostHog.

**Follow-up issue — production configuration must be confirmed.** Local `.env` contains the configured values, but deployment injection was not tested. If `POSTHOG_PROJECT_TOKEN` or `POSTHOG_HOST` is absent in the deployed process, production intentionally becomes a no-op and analytics will be silently absent.

## Build conflicts

None reported. The review handoff reports that `pip3 install -r requirements.txt` and `python3 -m compileall app` succeeded. No test suite was run, and no full production build, lint, or typecheck was performed.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run only verified compilation with `python3 -m compileall app`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites in `app/routers/auth.py`, `app/routers/generate.py`, `app/routers/api_keys.py`, and `app/routers/settings.py`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env`; inspect the configuration usage in `app/config.py` and `app/main.py`.
- [ ] Exercise the instrumented routes in a configured deployment and confirm events arrive in PostHog; inspect the capture call sites in `app/routers/auth.py`, `app/routers/generate.py`, `app/routers/api_keys.py`, and `app/routers/settings.py`.
- [ ] Confirm returning authenticated requests retain the stable user identity by checking the middleware path in `app/middleware.py` and the post-auth contexts in `app/routers/auth.py`.
