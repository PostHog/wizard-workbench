# PostHog setup report

PostHog server-side analytics is installed and initialized for this Django SaaS app, with authenticated context, product-event capture, automatic exception tracking, and a starter dashboard.

## Installed and initialized

- Added the `posthog` Python SDK to `requirements.txt`; version 7.31.0 was installed successfully during the run.
- Added a process-wide `Posthog()` instance in `config/posthog.py`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Initialization enables `enable_exception_autocapture=True` and registers SDK shutdown with `atexit`.
- Django initializes the client from `AppConfig.ready()` and uses `posthog.integrations.django.PosthogContextMiddleware` after `AuthenticationMiddleware`.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example`; both keys were present in the local `.env` during the run.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_registered` | A new account is created and authenticated. | `accounts/views.py` |
| `settings_updated` | An authenticated user saves account settings. | `accounts/views.py` |
| `project_created` | An authenticated user creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user updates a project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a project. | `dashboard/views.py` |
| `checkout_started` | An authenticated user begins Stripe Checkout for a plan. | `billing/views.py` |
| `subscription_started` | An authenticated user starts a subscription in demo mode. | `billing/views.py` |
| `subscription_activated` | A Stripe checkout webhook activates a subscription. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user completes a plan change. | `billing/views.py` |
| `subscription_canceled` | An authenticated user completes subscription cancellation. | `billing/views.py` |
| `subscription_payment_failed` | A Stripe webhook marks a subscription as past due after payment failure. | `billing/views.py` |

The run verified eleven capture call sites by review and recorded them in `.posthog-wizard-cache/.posthog-events.json`. It did **not** observe events arriving in PostHog; the dashboard may remain empty until the application emits traffic.

## User identification

Identification was wired. The `user_logged_in` signal in `config/apps.py` calls `identify_context(str(user.pk))` and sets email and username as person properties. The middleware supplies authenticated request context for ordinary requests, while the login signal fixes the context after Django login. Webhook handlers explicitly use the resolved subscription user ID because they run outside normal request identity context. No `DISTINCT_ID` placeholders were reported.

## Error tracking

Unhandled Django request exceptions are covered by the SDK's `enable_exception_autocapture=True` and `PosthogContextMiddleware`. No manual per-view exception wrappers were added. The run verified the configuration by review, but did not execute a failing request or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914207)

The dashboard contains five tagged insights: registration-to-activation funnel, checkout starts by plan, project creation activity, subscription payment failures, and subscription cancellations by plan. New data will populate them as events arrive.

## Verification limits and conflicts

- Dependency installation succeeded (`posthog` 7.31.0 and the declared requirements were installed).
- Code review completed with zero fixes.
- No production build, typecheck, or lint command is defined by this requirements-based repository, so those checks were not run. The attempted `python -m venv .venv` was blocked by harness command policy and did not create or modify a directory.
- No event delivery, exception delivery, or end-to-end application run was observed during this workflow.
- No Content-Security-Policy was present, so no CSP change was needed.
- No unresolved build conflict was reported by any completed step.

## Before you merge

- [ ] Run the full production/deployment validation for this Django app and fix any runtime, lint, or type errors introduced by the integration; review `config/posthog.py`, `config/apps.py`, `config/settings.py`, `accounts/views.py`, `dashboard/views.py`, and `billing/views.py`.
- [ ] Run the test suite and update any mocks or fixtures affected by the new captures; focus on the instrumented handlers in `accounts/views.py`, `dashboard/views.py`, and `billing/views.py`.
- [ ] Confirm the exact environment variable names `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; review `.env.example` and the deployment configuration.
- [ ] Exercise representative authenticated, billing, and webhook paths and confirm the eleven planned events arrive in PostHog with stable distinct IDs; review capture call sites in `accounts/views.py`, `dashboard/views.py`, and `billing/views.py`.
- [ ] Trigger an uncaught Django request exception and confirm error tracking arrives in PostHog; review `config/posthog.py` and the middleware entry in `config/settings.py`.
- [ ] Verify the returning-authenticated-user path retains the stable identity established by the login signal; review `config/apps.py` and the middleware ordering in `config/settings.py`.
