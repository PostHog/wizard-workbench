# PostHog setup report

PostHog was added to the Django SaaS app with server-side event capture, authenticated-user identification, exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed the Python `posthog` SDK, resolving version 7.32.0, and declared `posthog` in `requirements.txt`.
- Initialized one shared PostHog client in `accounts/apps.py`, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment configuration.
- Enabled SDK exception autocapture and registered Django shutdown handling.
- Added `PosthogContextMiddleware` immediately after `AuthenticationMiddleware` in `config/settings.py`.
- Documented `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env.example`; both variables are present in the local `.env`.
- No browser assets or CSP changes were made; this is a server-side Django integration.

## Events instrumented

These are instrumented event definitions from `.posthog-wizard-cache/.posthog-events.json`. The run verified capture call locations in the changed files, but did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `account_registered` | A visitor completes registration and begins an authenticated session. | `accounts/views.py` |
| `profile_updated` | An authenticated user saves changes to account settings. | `accounts/views.py` |
| `project_created` | An authenticated user creates a project. | `dashboard/views.py` |
| `project_updated` | An authenticated user saves changes to a project. | `dashboard/views.py` |
| `project_deleted` | An authenticated user deletes a project. | `dashboard/views.py` |
| `checkout_started` | An authenticated user begins Stripe subscription checkout. | `billing/views.py` |
| `subscription_started` | An authenticated user activates a subscription after successful checkout or demo subscription. | `billing/views.py` |
| `subscription_plan_changed` | An authenticated user successfully changes an active subscription plan. | `billing/views.py` |
| `subscription_canceled` | An authenticated user cancels an active subscription. | `billing/views.py` |

Request-bound captures inherit the authenticated request identity. The Stripe webhook capture explicitly uses the resolved user's stable primary key because it runs outside request middleware. Captures contain bounded operational metadata and no PII.

## Identification

Identification was wired, not skipped. The `user_logged_in` signal in `accounts/apps.py` identifies the authenticated request context with `str(user.pk)` and sets email and username as person properties. `PosthogContextMiddleware` supplies the authenticated identity for requests that begin authenticated. Django's built-in login flow and registration call `login()`, so the run assumes the standard `user_logged_in` signal behavior remains in place.

The run did not exercise login, returning authenticated sessions, webhook delivery, or event ingestion. Production delivery therefore remains unconfirmed.

## Error tracking

Global error tracking was added through `enable_exception_autocapture=True` on the shared client, with `PosthogContextMiddleware` providing request context and attribution. No manual exception wrappers were added. The run verified configuration in source but did not trigger an exception and observe an error in PostHog.

## Verification

- `pip3 install -r requirements.txt` completed successfully and resolved PostHog 7.32.0.
- `python3 manage.py check` completed with: `System check identified no issues (0 silenced).`
- No explicit build, lint, or typecheck script was available; no production build was run.
- The run did not verify that any event or exception reached PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919709)

The dashboard contains three created insights: a registration-to-subscription funnel, account/project activity trends, and subscription lifecycle trends. They are configured with the captured event names and may remain empty until events are ingested.

## Unresolved issue

An optional fourth plan-breakdown insight could not be created because the PostHog MCP returned a fetch error. The starter dashboard was completed with three insights, but plan-level breakdown analysis is missing until that insight can be retried.

## Before you merge

- [ ] Run a full production build and fix any generated-code lint or type errors; the run only completed `python3 manage.py check` and did not run a production build (`config/settings.py` and the PostHog initialization in `accounts/apps.py`).
- [ ] Run the test suite and update mocks or fixtures for the new captures (`accounts/views.py`, `dashboard/views.py`, and `billing/views.py` capture call sites).
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment, not only local `.env`; confirm the exact names documented in `.env.example` and consumed by `accounts/apps.py`.
- [ ] Exercise registration, profile/project actions, checkout, subscription changes, cancellation, and the Stripe webhook, then confirm the nine named events arrive in PostHog (`accounts/views.py`, `dashboard/views.py`, and `billing/views.py`).
- [ ] Trigger a controlled application exception and confirm exception autocapture arrives in PostHog (`accounts/apps.py` client initialization and `config/settings.py` middleware registration).
- [ ] Retry the failed optional plan-breakdown insight creation in the `Analytics basics (wizard)` dashboard; the run recorded an MCP fetch error and did not create that tile.
