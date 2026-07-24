# PostHog setup report

PostHog server-side analytics was installed and initialized for Django, with authenticated request context, login identity, exception autocapture, 15 business events, and a starter dashboard.

## Installed and initialized

- Added the `posthog` Python SDK to `requirements.txt`; dependency installation resolved `posthog 7.29.0` (and `backoff`). No lockfile was present.
- `accounts/apps.py` initializes one `Posthog` client in `AccountsConfig.ready()` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enable_exception_autocapture=True`, registers shutdown flushing, and registers Django's login signal with `weak=False`.
- `config/settings.py` registers `AccountsConfig` and adds `posthog.integrations.django.PosthogContextMiddleware` immediately after `AuthenticationMiddleware`.
- `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the configured local `.env` contains both keys. The report does not reproduce secret values.
- The integration is server-side. No JavaScript SDK or Content Security Policy changes apply.

## Instrumented events

The following event contract was recorded in `.posthog-wizard-cache/.posthog-events.json` and implemented in the listed files:

| Event | What it measures | File |
|---|---|---|
| `user_registered` | A new account is created and the user is signed in. | `accounts/views.py` |
| `user_logged_in` | An existing user successfully completes authentication. | `accounts/views.py` |
| `user_logged_out` | An authenticated user signs out. | `accounts/views.py` |
| `password_reset_requested` | A user submits a password reset request. | `accounts/views.py` |
| `account_settings_updated` | An authenticated user saves profile settings. | `accounts/views.py` |
| `checkout_started` | An authenticated user starts a Stripe subscription checkout. | `billing/views.py` |
| `subscription_started` | A demo-mode subscription is created directly. | `billing/views.py` |
| `subscription_activated` | Stripe confirms checkout completion and a subscription is created. | `billing/views.py` |
| `subscription_plan_changed` | An active subscription is switched to another plan. | `billing/views.py` |
| `subscription_canceled` | An active subscription is canceled. | `billing/views.py` |
| `subscription_status_updated` | Stripe reports an updated subscription status. | `billing/views.py` |
| `payment_failed` | Stripe reports a failed subscription invoice payment. | `billing/views.py` |
| `project_created` | An authenticated user creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user updates a project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a project. | `dashboard/views.py` |

The run verified that capture call sites exist and match the event plan. It did **not** observe events arriving in PostHog; event delivery could not be exercised.

## User identification

Identification was wired. `PosthogContextMiddleware` attributes ordinary authenticated requests using the authenticated user's primary key, and webhook captures pass the associated user's stable primary key explicitly. The `user_logged_in` signal calls `identify_context(str(user.pk))` during login and registration requests, with email and username sent as person properties rather than event properties. Password-reset requests intentionally have no stable authenticated identity and are personless.

## Error tracking

Global uncaught exception tracking is enabled through the SDK client's `enable_exception_autocapture=True` and the PostHog Django context middleware. No duplicate manual exception wrapper was added. The run verified the configuration in source, but did not trigger an exception and observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902570) was created and tagged `wizard`. One `project_created` trend insight was successfully attached. Attempts to create additional insights using complex nested JSON were rejected by the MCP parser, so the dashboard currently contains the shell and that one confirmed tile.

## Verification and conflicts

- `pip install -r requirements.txt` completed successfully with `posthog 7.29.0`.
- `python manage.py check` reported `System check identified no issues (0 silenced)` before and after the runtime-correctness fix to retain the login signal receiver.
- The review found no lint/type/build script in the project root; Django system checks were the available build-equivalent verification.
- The runtime blocked `python manage.py collectstatic --noinput`. This is the full recorded build conflict; Django checks passed and no integration-owned static assets were changed.
- No event delivery, production deployment, full production build, or test-suite run was verified by this run.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; only `python manage.py check` was verified in this run.
- [ ] Run the test suite and update mocks or fixtures for the capture calls in `accounts/views.py`, `billing/views.py`, and `dashboard/views.py` if needed.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env`.
- [ ] Exercise the instrumented authentication, billing, webhook, and project flows and confirm the corresponding events arrive in PostHog; arrival was not observed during this run.
- [ ] If authentication is tested in production, verify returning authenticated requests continue using the stable user primary-key identity, not fragmented anonymous IDs; the relevant wiring is in `accounts/apps.py` and `config/settings.py`.
- [ ] Complete the starter dashboard with the remaining event insights if required; only the `project_created` tile was successfully attached, at dashboard `https://us.posthog.com/project/483112/dashboard/1902570`.
