<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The following changes were made:

- **`accounts/apps.py`** (new file): Created `AccountsConfig` with `ready()` method that initializes the PostHog Python SDK using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`).
- **`config/settings.py`**: Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`, added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic session/user context extraction and exception autocapture, and added `POSTHOG_API_KEY` / `POSTHOG_HOST` settings sourced from environment variables.
- **`accounts/views.py`**: Added event tracking to `CustomLoginView.form_valid()` (`user_logged_in`), `CustomLogoutView.dispatch()` (`user_logged_out`), `register()` (`user_registered`), and `settings()` (`profile_updated`). Login and registration also call `posthog.identify_context()` and `posthog.tag()` to associate person properties with the user.
- **`billing/views.py`**: Added `checkout_initiated` when Stripe checkout begins, `subscription_started` for demo-mode subscriptions, `subscription_activated` in the `_handle_checkout_completed` webhook handler, `plan_changed` after a successful plan change, `subscription_canceled` on cancellation, and `payment_failed` in the `_handle_payment_failed` webhook handler.
- **`dashboard/views.py`**: Added `project_created` and `project_deleted` events in the respective view functions.
- **`requirements.txt`**: Added `posthog` dependency.
- **`.env`**: Set `POSTHOG_API_KEY` and `POSTHOG_HOST` (covered by `.gitignore`).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | User successfully completes registration and is logged in | `accounts/views.py` |
| `user_logged_in` | User successfully authenticates and logs in | `accounts/views.py` |
| `user_logged_out` | User logs out of the application | `accounts/views.py` |
| `profile_updated` | User saves changes to their profile settings | `accounts/views.py` |
| `checkout_initiated` | User starts the Stripe checkout process for a subscription plan | `billing/views.py` |
| `subscription_started` | User subscribes to a plan in demo mode (no Stripe) | `billing/views.py` |
| `subscription_activated` | Stripe webhook confirms checkout completed and subscription is created | `billing/views.py` |
| `plan_changed` | User successfully changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | User cancels their active subscription | `billing/views.py` |
| `payment_failed` | Stripe webhook reports a failed invoice payment | `billing/views.py` |
| `project_created` | User creates a new project in the dashboard | `dashboard/views.py` |
| `project_deleted` | User deletes an existing project from the dashboard | `dashboard/views.py` |

## Next steps

We've designed a set of insights for an "Analytics basics" dashboard to track key business metrics. Create a new dashboard in [PostHog](https://us.posthog.com/project/2/dashboard) named **"Analytics basics"** and add the following 5 insights:

1. **Signup → Subscription Conversion Funnel** — Funnel: `user_registered` → `checkout_initiated` → `subscription_activated` (or `subscription_started`). Tracks how many new users convert to paid subscribers.

2. **Daily Sign-ups & Logins** — Trends line chart with `user_registered` and `user_logged_in` over the past 30 days. Shows user acquisition and engagement trends.

3. **Churn Events (Weekly)** — Trends line chart with `subscription_canceled` and `payment_failed` over the past 90 days. Key signal for revenue health.

4. **Subscription Activations (Weekly)** — Trends bar chart of `subscription_activated` and `subscription_started` over the past 30 days. Tracks revenue conversion velocity.

5. **Project Engagement** — Trends line chart with `project_created` and `project_deleted` over the past 30 days. Shows how actively users are engaging with the core product feature.

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [PostHog Insights](https://us.posthog.com/project/2/insights)
- [PostHog Error Tracking](https://us.posthog.com/project/2/error_tracking) — Exceptions are automatically captured by `PosthogContextMiddleware`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
