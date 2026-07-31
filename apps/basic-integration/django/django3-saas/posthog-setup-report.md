# PostHog setup report

PostHog was added to the Django SaaS project with environment-backed initialization, authenticated-user identification, nine business-event captures, framework-level exception autocapture, and a starter analytics dashboard.

## Installed and initialized

- Installed the Python PostHog SDK `posthog` 7.35.4 and declared it in `requirements.txt`; this project has no lockfile.
- Added an AppConfig in `posthog_config/apps.py` that creates one shared `posthog.Posthog` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables `enable_exception_autocapture=True`, exposes the client as `posthog.client`, and shuts it down at process exit.
- Registered `posthog_config.apps.PostHogConfig` and `posthog.integrations.django.PosthogContextMiddleware` after Django's `AuthenticationMiddleware` in `config/settings.py`.
- Documented the environment keys in `.env.example`; the real values were configured locally in `.env` through the wizard environment tooling.

## Events instrumented

The run verified that these capture calls were added at successful action boundaries. It did **not** observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_registered` | A new account is created and the user is signed in. | `accounts/views.py` |
| `profile_updated` | An authenticated user saves account settings. | `accounts/views.py` |
| `subscription_checkout_started` | An authenticated user starts Stripe Checkout for a selected plan. | `billing/views.py` |
| `subscription_activated` | A demo subscription is created or Stripe checkout completes successfully. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user successfully changes their subscription plan. | `billing/views.py` |
| `subscription_canceled` | An authenticated user successfully cancels a subscription. | `billing/views.py` |
| `project_created` | An authenticated user creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user saves changes to a project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a project. | `dashboard/views.py` |

Authenticated request events inherit identity from the Django PostHog middleware. The Stripe webhook activation event resolves a stable user primary key from Stripe metadata because it runs outside a user request.

## Identification

Identification was wired, not skipped. The `user_logged_in` signal receiver in `posthog_config/apps.py` calls `identify_context(str(user.pk))` and sends email, username, and company name as person properties rather than event properties. The middleware supplies the authenticated user's primary-key identity on subsequent requests. No event-capture call was reported with a `DISTINCT_ID` placeholder.

## Error tracking

Framework-level exception tracking is enabled through `enable_exception_autocapture=True` in `posthog_config/apps.py`, with `PosthogContextMiddleware` installed in `config/settings.py`. No manual per-view exception wrappers were added. The run verified configuration and a successful Django system check, but did not trigger an exception or observe an error event in PostHog.

## Verification and limits

- `.venv/bin/pip install -r requirements.txt` completed successfully with `posthog-7.35.4`.
- `.venv/bin/python manage.py check` passed twice with `System check identified no issues (0 silenced)`.
- The review found no separate build, typecheck, lint, or test command in the project and did not run a test suite.
- No event flow, exception delivery, production deployment, or dashboard population was observed. Dashboard insights may remain empty until events arrive.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935568) contains five tiles: signup-to-subscription funnel, activation trend, cancellation trend, plan changes by plan, and project creation activity. The dashboard was created successfully in PostHog; its data is not evidence that events have been received.

## Build conflicts

No build conflict was reported. Django's configured system check passed. A full production build, lint run, and test suite were not run, so those outcomes remain unconfirmed.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced in `requirements.txt`, `posthog_config/apps.py`, `config/settings.py`, `accounts/views.py`, `billing/views.py`, or `dashboard/views.py`.
- [ ] Run the test suite and update mocks or fixtures for the capture and login-signal changes in `accounts/views.py`, `billing/views.py`, `dashboard/views.py`, and `posthog_config/apps.py`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only `.env`; confirm the names documented in `.env.example` are present in deployment/bootstrap configuration.
- [ ] Exercise registration, profile save, checkout, subscription activation, plan change, cancellation, and project CRUD, then confirm the nine named events arrive in PostHog with the expected stable identities.
- [ ] Trigger a controlled Django exception and confirm exception autocapture arrives in PostHog; verify the request identity supplied by `config/settings.py`.
- [ ] Confirm returning authenticated sessions continue to use the identified primary-key identity through `posthog_config/apps.py` and the middleware entry in `config/settings.py`.
