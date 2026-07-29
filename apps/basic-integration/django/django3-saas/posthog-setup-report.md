# PostHog setup report

## Summary

This run installed and initialized PostHog for the Django server, wired authenticated-user identification and global exception autocapture, instrumented 12 server-side events, and created a starter analytics dashboard.

## Installed and initialized

- Added the `posthog` Python package to `requirements.txt`; review installed PostHog 7.33.0 in the project-local `.venv`.
- `accounts/apps.py` creates one `Posthog` client in `AccountsConfig.ready()` using the `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables, enables `enable_exception_autocapture=True`, and registers shutdown with `atexit`.
- `config/settings.py` enables `posthog.integrations.django.PosthogContextMiddleware` immediately after Django authentication middleware.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example` and were configured locally in `.env` through the wizard tools. Deploy environments still need these values.

## Events instrumented

These are the event contracts recorded by the run. The run did not observe any of these events arriving in PostHog, so delivery and population remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An authenticated user successfully completes a login. | `accounts/views.py` |
| `user_logged_out` | An authenticated user starts a logout while the request remains attributed. | `accounts/views.py` |
| `user_registered` | A new user account is successfully created and signed in. | `accounts/views.py` |
| `account_settings_updated` | An authenticated user successfully saves account settings. | `accounts/views.py` |
| `project_created` | An authenticated user creates a workspace project. | `dashboard/views.py` |
| `project_updated` | An authenticated user updates a workspace project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a workspace project. | `dashboard/views.py` |
| `checkout_started` | An authenticated user starts a subscription checkout. | `billing/views.py` |
| `subscription_started` | An authenticated user gains an active subscription. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user successfully changes subscription plan. | `billing/views.py` |
| `subscription_canceled` | An authenticated user cancels an active subscription. | `billing/views.py` |
| `subscription_payment_failed` | A Stripe webhook marks a subscription as past due after payment failure. | `billing/views.py` |

## Identification and attribution

Identification was wired. The Django `user_logged_in` signal calls `identify_context(str(user.pk))` and sets person properties through the shared client. The middleware identifies already-authenticated requests from the user primary key, and webhook captures explicitly use the related stable user ID. Event properties were reviewed as metadata-only; emails, names, plan names, and Stripe identifiers were not placed in capture properties.

The run did not exercise login, registration, authenticated requests, webhooks, or production delivery. The SDK constructor and capture signatures were reviewed by inspection and passed Django's startup check, but event arrival was not verified.

## Error tracking

Global uncaught-request exception tracking is enabled through `enable_exception_autocapture=True` in `accounts/apps.py` plus `PosthogContextMiddleware` in `config/settings.py`. No manual exception wrappers were added. The run did not trigger an exception or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924569) contains five wizard-tagged insights covering registration-to-project conversion, authentication activity, project lifecycle activity, subscription conversion, and subscription health. The definitions use the instrumented event names and 30-day ranges; they may remain empty until events arrive.

## Verification and conflicts

- `pip install -r requirements.txt` completed in `.venv` and installed Django 4.2.30 and PostHog 7.33.0.
- `.venv/bin/python manage.py check` completed with “System check identified no issues (0 silenced).”
- Review found no lint, typecheck, or build configuration; no production build was run.
- No build conflict was reported. There were no other conflicts or skipped integration steps.

A passing Django system check proves imports and application configuration start successfully; it does not prove that events flow to PostHog. Delivery, SDK behavior during real requests, and dashboard data remain unconfirmed.

## Issues to follow up

1. **Event delivery is unresolved.** No run step observed an event arrive in PostHog. If left unresolved, the dashboard and the 12 event contracts can remain empty even though the application starts successfully.
2. **Runtime SDK behavior is unresolved.** The run assumed the installed SDK supports the instance constructor, `identify_context`, and the capture signatures used by the integration; no authenticated request or webhook exercised them. If incompatible at runtime, attribution or event delivery could fail silently or raise during user actions.

## Before you merge

- [ ] Run a full production deployment/build and fix any lint or type errors introduced by the integration; the run only executed Django's system check. Inspect `accounts/apps.py`, `config/settings.py`, `accounts/views.py`, `dashboard/views.py`, and `billing/views.py` if failures point to generated integration code.
- [ ] Run the test suite; the instrumented call sites in `accounts/views.py`, `dashboard/views.py`, and `billing/views.py` may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; inspect `.env.example`, `config/settings.py`, and deployment configuration.
- [ ] Exercise login, registration, an authenticated project action, a billing action, and a payment-failure webhook in a safe environment, then confirm the expected events arrive in PostHog and populate the dashboard at the link above.
- [ ] Confirm a returning authenticated request remains attributed to the stable user primary key, and verify person properties appear on the person rather than in event properties; inspect `accounts/apps.py` and `config/settings.py`.
