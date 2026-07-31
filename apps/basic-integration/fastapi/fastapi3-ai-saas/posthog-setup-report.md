# PostHog setup report

PostHog analytics, user identification, product-event capture, and centralized error tracking were added to the FastAPI application, with a starter dashboard created in PostHog.

## Installed and initialized

- Added `posthog>=7.35.4` to `requirements.txt`; `pip3 install posthog` and `pip3 install -r requirements.txt` completed successfully. No lockfile was present.
- PostHog is initialized during FastAPI lifespan startup by `app/posthog.py` using the environment-backed `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings. The shared `Posthog` client enables exception autocapture, and shutdown/flush handling is registered for application exit.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example` and were confirmed present in the local `.env`. Their values are intentionally not reproduced here.
- Missing configuration remains a production no-op but fails loudly in development/debug mode, as required by the framework rules.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user successfully signs in. | `app/routers/auth.py` |
| `user_signed_up` | A new account is successfully created. | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user ends their session. | `app/routers/auth.py` |
| `content_generated` | An AI content generation completes successfully. | `app/routers/generate.py` |
| `generation_blocked_insufficient_credits` | A generation attempt is blocked because the account lacks credits. | `app/routers/generate.py` |
| `api_key_created` | An authenticated user creates an API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes an API key. | `app/routers/api_keys.py` |
| `email_updated` | An authenticated user successfully updates their email address. | `app/routers/settings.py` |
| `password_changed` | An authenticated user successfully changes their password. | `app/routers/settings.py` |

The event plan deliberately excludes dashboard and usage-history reads because they are views rather than core user actions. Event delivery was not observed during this run, so the events are instrumented but unconfirmed as captured in PostHog.

## User identification

Identification was wired. `PostHogMiddleware` resolves the signed session cookie and identifies authenticated users with the stable database user ID. Login and signup establish a fresh identified context after authentication or account creation; email and account metadata are person properties, not event properties. Returning authenticated requests inherit the identified request context. No stable-ID placeholders were reported.

## Error tracking

The existing global FastAPI 500 handler now sends uncaught exceptions through the shared PostHog client before returning the existing response. The client also enables `enable_exception_autocapture=True`. This feeds the PostHog Error Tracking issue stream. Error delivery was not exercised or observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935565)

The dashboard contains five tagged insights covering signup-to-content-generation conversion, authentication activity, generation and credit blocks, API-key lifecycle, and account-security changes. The insights may initially be empty until application traffic arrives.

## What was verified

- The PostHog SDK installation and requirements installation completed successfully.
- Environment-key presence was confirmed without exposing values.
- The changed integration files and all nine event-plan entries were reviewed; capture properties were operational metadata and no event contained PII.
- No project build, typecheck, lint, or test command was defined or run. No live event delivery or error delivery was observed.

## Unresolved issues and their cost

- **Live delivery remains unverified.** The run did not start the application or observe events/errors arrive in PostHog; without a real request flow, dashboard data and Error Tracking ingestion could still be affected by runtime configuration or delivery issues.
- **SDK shutdown behavior remains an assumption.** Review relied on the assumption that the SDK shutdown operation is safe alongside `atexit` registration; this was not runtime-tested. If incorrect, shutdown could affect event flushing during process exit.

## Build conflicts

No build conflict was reported. The review found no project build, typecheck, or lint script/manifest, so those checks were not available to run.

## Before you merge

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are configured in every deployment environment, not only the local `.env`; verify the names documented in `.env.example`.
- [ ] Exercise signup, login, logout, generation success and credit-block paths, API-key creation/revocation, email update, and password change, then confirm the nine named events arrive in PostHog.
- [ ] Trigger a representative uncaught server error and confirm it appears in PostHog Error Tracking.
- [ ] Confirm returning authenticated requests continue to identify users correctly by reviewing `app/middleware.py` and the auth context setup in `app/routers/auth.py`.
