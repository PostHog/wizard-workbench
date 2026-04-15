<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The following changes were made:

- **`accounts/apps.py`** (new file): `AccountsConfig` initializes the PostHog SDK in `AppConfig.ready()`, ensuring it is configured once at Django startup using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings from environment variables, registered `accounts.apps.AccountsConfig` as the app config, and added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic session/user context extraction.
- **`accounts/views.py`**: Added PostHog event capture for user registration, login, logout, and profile settings updates, including `identify_context()` calls to associate events with the correct user.
- **`billing/views.py`**: Added PostHog event capture for subscription start, plan change, subscription cancel, checkout completion (server-side Stripe webhook), and payment failure (server-side Stripe webhook). Also added `posthog.capture_exception()` around Stripe API calls.
- **`dashboard/views.py`**: Added PostHog event capture for project creation, project update, and project deletion.
- **`requirements.txt`**: Added `posthog` dependency.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | User successfully completes registration | `accounts/views.py` |
| `user_logged_in` | User authenticates via login form | `accounts/views.py` |
| `user_logged_out` | User logs out | `accounts/views.py` |
| `profile_settings_updated` | User saves their profile settings | `accounts/views.py` |
| `subscription_started` | User initiates a subscription | `billing/views.py` |
| `subscription_canceled` | User cancels their subscription | `billing/views.py` |
| `plan_changed` | User changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Stripe checkout.session.completed webhook | `billing/views.py` |
| `payment_failed` | Stripe invoice.payment_failed webhook | `billing/views.py` |
| `project_created` | User creates a new project | `dashboard/views.py` |
| `project_updated` | User saves edits to a project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to monitor your key business metrics:

1. **Registration-to-subscription funnel** — Funnel insight: `user_registered` → `subscription_started` → `checkout_completed`. Shows your conversion rate from new signups to paying customers.
2. **New user registrations over time** — Trend insight: count of `user_registered` events per day/week.
3. **Subscription churn** — Trend insight: count of `subscription_canceled` + `payment_failed` events over time.
4. **Plan change breakdown** — Breakdown insight: `plan_changed` events broken down by `new_plan_name` property.
5. **Project activity** — Trend insight: `project_created`, `project_updated`, `project_deleted` as separate series to track user engagement with the core product feature.

Build your dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
