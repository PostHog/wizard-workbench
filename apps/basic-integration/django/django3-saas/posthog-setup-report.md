# PostHog setup report

PostHog was added to the Django SaaS app with centralized initialization, authenticated-user attribution, product-event instrumentation, automatic exception capture, and a starter dashboard.

## Installed and initialized

- Installed the published Python SDK `posthog` version 7.32.0 with `pip install posthog` and declared the bare `posthog` dependency in `requirements.txt`.
- `config/apps.py` initializes one shared `posthog.Posthog` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables exception autocapture, and registers shutdown at process exit.
- `config/settings.py` registers `ConfigConfig` and `PosthogContextMiddleware` after Django's `AuthenticationMiddleware`.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example`; the real configured values were set in `.env` through the wizard environment tooling.

## Events instrumented

The following ten event definitions were recorded in `.posthog-wizard-cache/.posthog-events.json` and instrumented in the listed files:

| Event | What it measures | File |
|---|---|---|
| `user_registered` | A new account is successfully created and authenticated. | `accounts/views.py` |
| `account_settings_updated` | An authenticated user successfully saves account settings. | `accounts/views.py` |
| `checkout_started` | An authenticated user starts a Stripe Checkout subscription flow. | `billing/views.py` |
| `subscription_started` | An authenticated user receives a demo subscription. | `billing/views.py` |
| `subscription_activated` | A verified Stripe checkout webhook creates a subscription. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user successfully changes an existing subscription plan. | `billing/views.py` |
| `subscription_canceled` | An authenticated user successfully cancels a subscription. | `billing/views.py` |
| `project_created` | An authenticated user successfully creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user successfully updates a project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user successfully deletes a project. | `dashboard/views.py` |

The capture step verified that calls are placed after successful state changes, or immediately before the successful Stripe Checkout redirect. The webhook capture explicitly supplies `str(user.pk)` because it runs outside request identity. The run did **not** observe events arriving in PostHog; the event list describes instrumented definitions, not confirmed deliveries.

## User identification

Identification was wired. `accounts/models.py` registers a `user_logged_in` receiver that identifies the ambient PostHog request context with the stable Django user primary key and sends email, full name, company name, and staff status as person properties. `PosthogContextMiddleware` identifies authenticated users on subsequent requests. No PII is included in event properties.

## Error tracking

Global uncaught-exception tracking is configured centrally through the shared client in `config/apps.py` with `enable_exception_autocapture=True`, together with `PosthogContextMiddleware` in `config/settings.py`. No manual `capture_exception` calls were added.

## Verification

- `.venv/bin/pip install -r requirements.txt` completed successfully and installed `posthog` 7.32.0.
- `.venv/bin/python manage.py check` passed with `System check identified no issues (0 silenced).`
- The passing Django system check verifies application configuration compiles/checks; it does **not** verify that analytics events or exceptions were delivered to PostHog.
- No delivery test was run, and no event arrival was observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918206)

The dashboard contains five tagged insights: a registration-to-checkout funnel, subscription lifecycle trends, checkout starts by plan, project activity, and account settings updates. These are definitions over the intended captures and may initially be empty until events arrive.

## Build conflicts

No unresolved build conflict was reported. The review step removed a duplicated `posthog` requirement and a redundant signal docstring, and moved the global `posthog_client` assignment to the start of `ConfigConfig.ready()` to make initialization valid Python. The project-local `.venv` was created for verification only and is not a declared source dependency.

## Issues to follow up

- Event delivery remains unconfirmed. Without exercising the instrumented paths and checking PostHog, the dashboard may remain empty even though the code passes Django's system check.
- The capture step explicitly left billing follow-up opportunities outside this pass: subscription status-change events and failed-payment events are not instrumented. If those states matter to lifecycle or revenue reporting, they need a separate event contract and implementation.
- The initialization handoff assumes the installed SDK supports the documented module-level `identify_context` helper alongside the configured client; this assumption was not validated by a delivery test.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced around `config/apps.py`, `config/settings.py`, `accounts/models.py`, `accounts/views.py`, `billing/views.py`, and `dashboard/views.py`; only `.venv/bin/python manage.py check` was run here.
- [ ] Run the test suite, especially authentication, account settings, billing/webhook, and project view tests; instrumented call sites may require updated mocks or fixtures. Review `accounts/models.py`, `accounts/views.py`, `billing/views.py`, and `dashboard/views.py`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only locally; verify the names against `.env.example` and the initialization in `config/apps.py`.
- [ ] Exercise representative registration, settings, checkout, subscription, webhook, and project actions, then confirm the ten named events arrive in PostHog and are attributed to stable user IDs where expected; review the capture call sites in `accounts/views.py`, `billing/views.py`, and `dashboard/views.py`.
- [ ] Trigger a controlled uncaught exception in a safe environment and confirm automatic exception capture, reviewing `config/apps.py` and `config/settings.py`.
- [ ] If billing reporting needs subscription status changes or failed payments, decide and implement those missing events in `billing/views.py` before relying on lifecycle reporting.
