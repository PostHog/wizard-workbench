<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. Here is a summary of all changes made:

- **`requirements.txt`**: Added `posthog` as a dependency.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings read from environment variables. Added `posthog.integrations.django.PosthogContextMiddleware` to the `MIDDLEWARE` list (auto-extracts session/user context for all requests). Changed `accounts` entry in `INSTALLED_APPS` to `accounts.apps.AccountsConfig` to enable AppConfig.
- **`accounts/apps.py`** (new file): Created `AccountsConfig` with a `ready()` method that initializes `posthog.api_key` and `posthog.host` from Django settings when the app starts.
- **`accounts/views.py`**: Added `user_logged_in` (on successful login via `CustomLoginView.form_valid`), `user_logged_out` (on logout via `CustomLogoutView.dispatch`), `user_registered` (on new registration), and `settings_updated` (on profile save). User identity is set with `identify_context()` and person properties via `tag()` on all auth events.
- **`billing/views.py`**: Added `checkout_initiated` (before Stripe redirect), `subscription_started` (on demo subscription creation), `plan_changed` (on both Stripe and demo plan changes), `subscription_canceled` (on cancellation), `checkout_completed` (in the Stripe webhook handler), and `payment_failed` (in the payment failure webhook handler). Exception capture added around payment errors.
- **`dashboard/views.py`**: Added `project_created` (after project save) and `project_deleted` (after project deletion).

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completed registration and was logged in | `accounts/views.py` |
| `user_logged_in` | A user successfully authenticated via login form | `accounts/views.py` |
| `user_logged_out` | A user logged out of their session | `accounts/views.py` |
| `settings_updated` | A user saved changes to their profile/account settings | `accounts/views.py` |
| `checkout_initiated` | User was redirected to Stripe Checkout to start a subscription | `billing/views.py` |
| `subscription_started` | User successfully subscribed to a plan (demo or Stripe) | `billing/views.py` |
| `plan_changed` | User changed their active subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their active subscription | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirmed a successful checkout session | `billing/views.py` |
| `payment_failed` | Stripe webhook reported a failed invoice payment | `billing/views.py` |
| `project_created` | User created a new project in the dashboard | `dashboard/views.py` |
| `project_deleted` | User deleted a project from the dashboard | `dashboard/views.py` |

## Next steps

To explore analytics for these events, head to your PostHog project and build insights:

- **Signup → Subscription funnel**: `user_registered` → `checkout_initiated` → `subscription_started` — see where users drop off on the way to paid.
- **Churn tracking**: `subscription_canceled` and `payment_failed` trends over time.
- **Engagement**: `project_created` and `project_deleted` activity per user.
- **Login frequency**: `user_logged_in` daily/weekly trends.

You can create a dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
