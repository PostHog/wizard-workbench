# PostHog setup report

PostHog analytics, authenticated-user attribution, automatic Django exception tracking, and a starter SaaS dashboard were added to this Django application.

## What was installed and initialized

- Added the `posthog` Python SDK to `requirements.txt`; the run installed version 7.32.0 in the verification environment.
- PostHog is initialized during Django app startup in `config/apps.py`, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment. The SDK is configured for exception autocapture and registered for shutdown flushing.
- `posthog.integrations.django.PosthogContextMiddleware` is installed after Django authentication middleware in `config/settings.py`, providing request context and automatic exception capture.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example`; the real values were configured in `.env` during the run. Do not commit `.env` or move its secret value into source code.

## Instrumented events

These are the 14 events recorded in `.posthog-wizard-cache/.posthog-events.json` and implemented during the run. The run verified that capture call sites exist; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `account_registered` | A new account is created and authenticated. | `accounts/views.py` |
| `account_logged_in` | An authenticated user successfully signs in. | `accounts/views.py` |
| `account_logged_out` | An authenticated user signs out. | `accounts/views.py` |
| `profile_updated` | An authenticated user saves account settings. | `accounts/views.py` |
| `subscription_checkout_started` | An authenticated user starts Stripe Checkout for a plan. | `billing/views.py` |
| `subscription_started` | A demo subscription is successfully created. | `billing/views.py` |
| `subscription_checkout_completed` | Stripe confirms checkout and the subscription is persisted. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user successfully changes subscription plan. | `billing/views.py` |
| `subscription_canceled` | An authenticated user cancels an active subscription. | `billing/views.py` |
| `billing_portal_opened` | An authenticated user opens the Stripe billing portal. | `billing/views.py` |
| `subscription_payment_failed` | Stripe reports a failed invoice payment. | `billing/views.py` |
| `project_created` | An authenticated user creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user saves project changes. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a project. | `dashboard/views.py` |

## User identification

Identification was wired. The `user_logged_in` signal in `config/apps.py` identifies the ambient login context with the stable Django user primary key and sets person properties. Authenticated request captures use the Django PostHog context middleware; Stripe webhook captures bind the resolved user's stable primary key explicitly. No `DISTINCT_ID` placeholder was reported.

The run did not confirm live identity or event delivery. It confirmed the configured call paths and code review only.

## Error tracking

Automatic error tracking was enabled globally through SDK exception autocapture in `config/apps.py` and the Django PostHog context middleware in `config/settings.py`. No manual per-view exception wrappers were added. The run verified configuration and middleware placement, but did not trigger an exception and observe an error event in PostHog.

## Dashboard

The starter dashboard **Analytics basics (wizard)** and five insights were created and attached to dashboard 1918787. They cover account-to-subscription conversion, subscription starts, checkout starts by plan, subscription risk signals, and project creation activity.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918787)

The dashboard and insights were created successfully, but the dashboard was intentionally built from planned event names; the run did not verify that data has been ingested.

## Verification and unresolved issues

- `requirements.txt` installation completed successfully in `.venv`.
- `.venv/bin/python manage.py check` passed with no Django system-check issues.
- No dedicated build, lint, or typecheck command was available, and no live event-delivery test was run.
- One dashboard insight creation initially failed because of malformed JSON escaping; the corrected funnel payload succeeded. No resulting dashboard conflict remained.
- The review found no unrelated changes, PII in event properties, CSP changes, or unreachable instrumentation.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`.
2. Exercise registration, login/logout, profile, project, billing, and Stripe webhook paths in a deployed or representative environment, then confirm the 14 event names and expected properties arrive in PostHog.
3. Trigger an uncaught request exception and confirm the error appears in PostHog with the expected authenticated context.
4. Review the dashboard after ingestion and adjust insight filters or properties to match real production traffic.

## Before you merge

- [ ] Run the full production/deployment build and fix any lint or type errors introduced by the integration; the run only verified `python manage.py check` (`config/apps.py`, `config/settings.py`).
- [ ] Run the test suite and update mocks or fixtures for the new captures (`accounts/views.py`, `billing/views.py`, `dashboard/views.py`).
- [ ] Confirm the exact environment keys `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` documented in `.env.example` are configured in each deployment environment (`.env.example`, `config/settings.py`).
- [ ] Exercise authenticated returning-visitor requests and confirm they retain the identified user rather than fragmenting onto anonymous IDs (`config/apps.py`, `config/settings.py`).
- [ ] Trigger representative successful actions and verify all 14 events arrive in PostHog; code compilation alone does not prove delivery (`accounts/views.py`, `billing/views.py`, `dashboard/views.py`).
