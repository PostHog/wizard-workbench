<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here's a summary of what was done:

**Configuration:**
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env`
- Added PostHog settings to `config/settings.py`
- Created `accounts/apps.py` with `AccountsConfig` that initializes the PostHog SDK in `ready()`
- Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`
- Added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` (auto-extracts session/user context and captures exceptions)
- Added `posthog` to `requirements.txt`

**Event tracking added across three files:**

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `account_settings_updated` | Fired when a user saves their profile/settings | `accounts/views.py` |
| `subscription_checkout_initiated` | Fired when a Stripe Checkout session is created | `billing/views.py` |
| `subscription_started` | Fired when a user subscribes in demo mode | `billing/views.py` |
| `subscription_checkout_completed` | Fired in the Stripe webhook after successful checkout | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user edits an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

All events use `posthog.new_context()` + `posthog.identify_context(user_id)` to tie events to users. User identity properties (username, is_staff) are set via `posthog.tag()` on login and registration.

## Next steps

We've instrumented all the key business events. To visualize them, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Signup → Subscription funnel**: Steps `user_registered` → `subscription_checkout_initiated` → `subscription_checkout_completed` to measure conversion rate
- **Daily active users**: Unique users who fired `user_logged_in` over time
- **Churn trend**: Count of `subscription_canceled` events over time
- **Plan change breakdown**: Count of `subscription_plan_changed` broken down by `new_plan_slug`
- **Project engagement**: Count of `project_created` + `project_updated` events per user over time

Visit your PostHog project to build these insights:
- Dashboard list: https://us.posthog.com/project/238460/dashboard
- Insights: https://us.posthog.com/project/238460/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
