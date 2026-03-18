<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog` as a dependency.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings read from environment variables; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`; updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`.
- **`accounts/apps.py`** *(new file)* — Created `AccountsConfig` with a `ready()` method that initializes PostHog using `posthog.api_key` and `posthog.host` from Django settings. Respects `POSTHOG_DISABLED` and `DEBUG` flags.
- **`accounts/views.py`** — Instrumented `CustomLoginView.form_valid()` with user identification and `user_logged_in` event; `CustomLogoutView.dispatch()` with `user_logged_out` event; `register()` with user identification and `user_registered` event; `settings()` with `profile_updated` event.
- **`billing/views.py`** — Instrumented `subscribe()` with `subscription_started` event (both Stripe and demo modes); `change_plan()` with `subscription_plan_changed` event; `cancel()` with `subscription_canceled` event; `_handle_checkout_completed()` with `subscription_checkout_completed` event (webhook); `_handle_payment_failed()` with `subscription_payment_failed` event (webhook). Also added `posthog.capture_exception()` calls around Stripe API calls.
- **`dashboard/views.py`** — Instrumented `create_project()` with `project_created` event; `edit_project()` with `project_updated` event; `delete_project()` with `project_deleted` event.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile settings | `accounts/views.py` |
| `subscription_started` | Fired when a user initiates subscription to a plan | `billing/views.py` |
| `subscription_checkout_completed` | Fired when a Stripe checkout session completes via webhook | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `subscription_payment_failed` | Fired when a subscription payment fails via webhook | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user edits an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog with the following insights to keep an eye on user behavior:

1. **Registration → Subscription conversion funnel** — Funnel from `user_registered` → `subscription_started` → `subscription_checkout_completed`. Track where users drop off in the paid conversion flow.

2. **Daily active users (signups & logins)** — Trend chart of `user_registered` and `user_logged_in` events over time. Monitor growth and engagement.

3. **Subscription churn** — Trend of `subscription_canceled` and `subscription_payment_failed` events. Watch for spikes that indicate retention problems.

4. **Project activity** — Trend of `project_created`, `project_updated`, and `project_deleted` events. Measures product engagement depth.

5. **Plan change distribution** — Breakdown of `subscription_plan_changed` events by `new_plan_slug` property. Understand upgrade vs. downgrade patterns.

Create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
