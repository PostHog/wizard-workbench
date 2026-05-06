<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here is a summary of all changes made:

## Changes summary

### New files
- **`accounts/apps.py`** — `AccountsConfig` with `ready()` that initializes the PostHog SDK (sets `api_key`, `host`, and `debug` mode) when Django starts.

### Modified files
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings (read from environment variables); updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic context extraction and exception capture.
- **`requirements.txt`** — Added `posthog` dependency.
- **`accounts/views.py`** — Added PostHog tracking for login (`CustomLoginView.form_valid`), logout (`CustomLogoutView.dispatch`), registration, and profile updates. Users are identified with `identify_context()` on login and signup.
- **`billing/views.py`** — Added tracking for `checkout_initiated`, `subscription_started` (demo), `checkout_completed` (webhook), `subscription_changed`, `subscription_canceled`, and `payment_failed`. Stripe exceptions are also captured with `posthog.capture_exception()`.
- **`dashboard/views.py`** — Added tracking for `project_created`, `project_updated`, and `project_deleted`.

### Environment variables
- **`.env`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_registered` | User successfully completed registration | `accounts/views.py` |
| `user_logged_in` | User successfully authenticated and logged in | `accounts/views.py` |
| `user_logged_out` | User logged out of their account | `accounts/views.py` |
| `profile_updated` | User saved changes to their profile/settings | `accounts/views.py` |
| `checkout_initiated` | User started a Stripe checkout session | `billing/views.py` |
| `subscription_started` | User subscribed to a plan (demo mode) | `billing/views.py` |
| `checkout_completed` | Stripe webhook: checkout.session.completed | `billing/views.py` |
| `subscription_changed` | User changed their active subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their active subscription | `billing/views.py` |
| `payment_failed` | Stripe webhook: invoice payment failed | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User edited an existing project | `dashboard/views.py` |
| `project_deleted` | User permanently deleted a project | `dashboard/views.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor your most critical business metrics:

1. **Registration trend** — Trends insight on `user_registered` (daily, last 30 days) — track signup volume over time.
2. **Signup → Subscription funnel** — Funnel insight: `user_registered` → `checkout_initiated` → `checkout_completed` — measure conversion from signup to paid.
3. **Subscription churn** — Trends insight on `subscription_canceled` and `payment_failed` — monitor churn and payment failures.
4. **Project engagement** — Trends insight on `project_created`, `project_updated`, `project_deleted` — track active usage in the product.
5. **Plan changes** — Trends insight on `subscription_changed` broken down by `new_plan_slug` — understand upgrade/downgrade behavior.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
