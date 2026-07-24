# PostHog setup report

PostHog analytics was added to the Django SaaS application, with server-side lifecycle events, authenticated user identification, exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed the published `posthog` Python SDK (`7.29.0`) and `backoff` (`2.2.1`) with pip.
- Declared `posthog` in `requirements.txt`.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example`; the real values were configured in the local `.env` through the wizard tools.
- `accounts/apps.py` creates one shared `posthog.Posthog` client during Django startup, enables exception autocapture, registers shutdown, and provides a production no-op client when configuration is absent.
- `posthog.integrations.django.PosthogContextMiddleware` is registered immediately after `AuthenticationMiddleware` in `config/settings.py`.

## Events instrumented

These are the eleven events recorded in the event plan and instrumented at server-side completion points:

| Event | What it measures | File |
|---|---|---|
| `user_registered` | A visitor completes account registration and starts an authenticated session. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully authenticates. | `accounts/views.py` |
| `user_logged_out` | An authenticated user ends their session. | `accounts/views.py` |
| `profile_updated` | A user saves changes to their account settings. | `accounts/views.py` |
| `project_created` | A user creates a project. | `dashboard/views.py` |
| `project_updated` | A user saves changes to a project. | `dashboard/views.py` |
| `project_deleted` | A user deletes a project. | `dashboard/views.py` |
| `subscription_started` | A subscription becomes active through demo mode or a completed Stripe checkout. | `billing/views.py` |
| `subscription_plan_changed` | A user successfully changes their subscription plan. | `billing/views.py` |
| `subscription_canceled` | A user cancels an active subscription. | `billing/views.py` |
| `subscription_payment_failed` | Stripe reports a failed payment for a known subscription. | `billing/views.py` |

Request-backed captures rely on the Django context middleware. Webhook captures use the resolved subscription user's stable primary key because webhooks run outside request context. Project text and PII were excluded from event properties.

## Identification

User identification was wired, not skipped. The `user_logged_in` signal in `accounts/apps.py` calls `identify_context` with the stable user primary key and sets person properties. The middleware identifies subsequent authenticated requests. No logout reset was added because this is a backend-only Django integration.

## Error tracking

Global uncaught request exceptions are configured through `PosthogContextMiddleware`, with the shared client initialized using `enable_exception_autocapture=True`. No scattered manual exception wrappers were added.

## Verification and limits

- `pip install -r requirements.txt` completed successfully.
- `python manage.py check` completed with `System check identified no issues (0 silenced)`.
- Review confirmed the integration's minimality, project-pattern alignment, middleware ordering, and initialization shape.
- The run did **not** observe events arriving in PostHog. The dashboard insights may therefore be empty until application traffic occurs; a passing Django system check proves configuration/code checks, not event delivery.
- No CSP was present in the inspected settings/templates, so no CSP changes were made.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901781)

The dashboard contains five tagged insights: signup-to-subscription funnel, account registrations, projects created, subscriptions started, and subscription cancellations.

## Issues and build conflicts

- The dashboard step had an initial parallel insight batch fail because of JSON quoting errors. All intended insights were subsequently created successfully; the dashboard is available at the link above.
- The initialization step originally had a conflict between the framework's required instance-based singleton and possible later module-level call sites. The review step resolved runtime safety by retaining the shared singleton and adding a production no-op client when configuration is absent.
- No remaining build conflict was reported. No standalone build, typecheck, or lint scripts were defined; Django's system check was the available verification.

## Next steps

1. Deploy `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every environment, using the names documented in `.env.example`; do not rely only on the local `.env`.
2. Exercise registration, login, project, subscription, and payment-failure paths in a configured environment and confirm the corresponding events arrive in PostHog.
3. Confirm identified users and person properties on authenticated traffic, and verify webhook events use the intended stable user identity.
4. Review the dashboard after real traffic arrives and adjust the five starter insights if product reporting needs differ.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; the wizard verified only `python manage.py check`.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in deployment environments, not just locally, and match the names in `.env.example`.
- [ ] If authentication tests or production smoke tests cover identified traffic, verify the returning-visitor path still calls identify so sessions do not fragment onto anonymous IDs (`config/settings.py`, `accounts/apps.py`).
