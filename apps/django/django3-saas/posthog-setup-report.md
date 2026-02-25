<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here is a summary of all changes made:

## Changes Summary

### New files created
- **`accounts/apps.py`** — Django `AppConfig` that initializes the PostHog Python SDK on startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables.
- **`.env`** — Environment file with `POSTHOG_API_KEY` and `POSTHOG_HOST` values (auto-covered by `.gitignore`).

### Modified files
- **`config/settings.py`** — Added PostHog configuration settings (`POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED`), changed `'accounts'` to `'accounts.apps.AccountsConfig'` in `INSTALLED_APPS`, and added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic session context and exception capture.
- **`requirements.txt`** — Added `posthog` dependency.
- **`accounts/views.py`** — Added event tracking for auth flows: user signup, login, logout, profile update, and password reset request. Login and signup events include user identification via `identify_context()`.
- **`billing/views.py`** — Added event tracking for the full subscription lifecycle: checkout initiation, demo subscription start, plan changes, subscription cancellations, webhook-triggered checkout completion, and payment failures. Also added `posthog.capture_exception()` to all payment-related exception handlers.
- **`dashboard/views.py`** — Added event tracking for project CRUD: project created, updated, and deleted.

## Event Tracking Table

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers and is logged in | `accounts/views.py` |
| `user_logged_in` | Fired when an existing user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of the application | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile/settings | `accounts/views.py` |
| `password_reset_requested` | Fired when a user submits a password reset request | `accounts/views.py` |
| `checkout_initiated` | Fired when a user is redirected to Stripe Checkout to start a paid subscription | `billing/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan in demo mode | `billing/views.py` |
| `checkout_completed` | Fired via Stripe webhook when a checkout session completes and a subscription is created | `billing/views.py` |
| `plan_changed` | Fired when a user successfully changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when a payment attempt fails | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user saves edits to an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. To create it in your PostHog project, visit your project and create a new dashboard with the following insights:

1. **User Signups** — Trend of `user_signed_up` events over time (user acquisition)
2. **Signup → Subscription Conversion Funnel** — Funnel: `user_signed_up` → `project_created` → `checkout_initiated` → `checkout_completed`
3. **Subscription Cancellations** — Trend of `subscription_canceled` over time (churn monitoring)
4. **New Subscriptions** — Combined trend of `checkout_completed` + `subscription_started` (revenue)
5. **Project Activity** — Combined trend of `project_created`, `project_updated`, `project_deleted` (activation & engagement)

[Create a new dashboard →](https://us.posthog.com/project/238460/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
