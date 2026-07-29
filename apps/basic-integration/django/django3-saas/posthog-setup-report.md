# PostHog setup report

PostHog was added to the Django SaaS app with one shared SDK client, authenticated-user context, exception autocapture, nine server-side business events, and a starter dashboard.

## What was installed and initialized

- Installed the Python `posthog` package, resolving version 7.33.0, and declared `posthog` in `requirements.txt`.
- Added the `posthog_integration` Django app. `posthog_integration/apps.py` creates one shared `Posthog` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enable_exception_autocapture=True`, and registers shutdown handling.
- Added `posthog.integrations.django.PosthogContextMiddleware` after Django's `AuthenticationMiddleware` in `config/settings.py`.
- Documented `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env.example`; the real values were configured through the wizard environment tooling during the run.
- Review changed missing configuration behavior: production uses a no-op client, while DEBUG raises a configuration error when either required variable is missing.

## Events instrumented

These are planned and instrumented call sites. The run did **not** observe events arriving in PostHog, because no application traffic or delivery test was run.

| Event | What it measures | File |
|---|---|---|
| `account_registered` | A new user successfully creates an account. | `accounts/views.py` |
| `account_settings_updated` | An authenticated user successfully saves profile settings. | `accounts/views.py` |
| `project_created` | An authenticated user creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user updates a project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a project. | `dashboard/views.py` |
| `subscription_checkout_started` | An authenticated user starts Stripe subscription checkout. | `billing/views.py` |
| `subscription_started` | An authenticated user successfully starts a demo subscription. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user successfully changes a subscription plan. | `billing/views.py` |
| `subscription_canceled` | An authenticated user successfully cancels a subscription. | `billing/views.py` |

The capture review confirmed calls occur after the corresponding successful business actions and use safe plan/billing metadata rather than PII. The subscription plan change event has multiple successful paths in `billing/views.py` (lines 143 and 155); both are intentional occurrences of the same event.

## User identification

Identification was wired, not skipped. A persistent `user_logged_in` receiver in `posthog_integration/apps.py` identifies users using the stable Django `User.pk`, and sends email, username, display name, and company name as person properties rather than event properties. Authenticated requests inherit that context through `PosthogContextMiddleware`, including exception autocapture. No event delivery or identity behavior was observed at runtime.

## Error tracking

Error tracking uses the SDK's built-in Django integration: `enable_exception_autocapture=True` in `posthog_integration/apps.py`, with `PosthogContextMiddleware` providing the Django-wide request/error boundary. No manual exception wrappers were added.

## Dashboard

The starter dashboard **Analytics basics (wizard)** is live with four views: an account-to-project activation funnel, project creation trend, subscription starts versus cancellations, and subscription plan changes by plan.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1926568)

The dashboard and insights were created from the intended event definitions, including empty-state-safe views. The run did not verify that captured events populate those views.

## What the run verified

- `pip install -r requirements.txt` completed in the project-local `.venv` and resolved `posthog` 7.33.0.
- `.venv/bin/python manage.py check` reported no issues.
- `.venv/bin/python -m compileall accounts billing dashboard posthog_integration config` completed successfully.
- The reviewed call sites and event plan contain the nine events listed above.
- The PostHog dashboard creation returned four dashboard tiles and successful insight metadata.

## What the run did not verify

- No application was started and no event was observed arriving in PostHog.
- No login, registration, project, billing, error, or dashboard end-to-end path was exercised.
- No test suite, dedicated linter, or full production build was run.
- Stripe webhook subscription lifecycle changes were not instrumented because they execute outside request identity context.
- `collectstatic --noinput` was not run because it was unavailable under the runtime command allowlist.

## Issues to follow up

- **Webhook attribution remains unresolved:** Stripe webhook subscription lifecycle changes were intentionally left without PostHog events because the webhook runs outside request identity context. If those changes need analytics, add explicit stable-user/session attribution to the webhook path; otherwise subscription lifecycle reporting may omit webhook-originated changes.
- **Delivery remains unconfirmed:** The run proved compilation and Django checks only. Without exercising the app and checking PostHog, event transport, authenticated attribution, and exception delivery remain unknown.

## Before you merge

- [ ] Run a full production build/deployment check and fix any lint or type errors introduced by the integration; this run only ran Django checks and Python compilation.
- [ ] Run the test suite, updating mocks or fixtures for the shared `posthog_integration.client` and the instrumented call sites as needed.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only locally; the exact names are documented in `.env.example`.
- [ ] Exercise registration, settings, project, and billing success paths, trigger an error, and confirm the corresponding events and exception data arrive in PostHog with stable authenticated attribution.
- [ ] Decide whether Stripe webhook-originated subscription changes need explicit attribution and instrumentation before relying on subscription lifecycle analytics.
