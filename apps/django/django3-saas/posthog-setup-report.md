<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS project. The following changes were made:

- **`posthog` package** added to `requirements.txt`
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings (read from environment variables), and registered `posthog.integrations.django.PosthogContextMiddleware` in `MIDDLEWARE`
- **`accounts/apps.py`** (new file): `AccountsConfig.ready()` initializes the PostHog SDK with the project token and host on Django startup
- **`config/settings.py`**: Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig` so the PostHog SDK initializes on startup
- **`accounts/views.py`**: Added event tracking for login, logout, registration, and profile updates; users are identified with `identify_context()` on login and registration
- **`billing/views.py`**: Added event tracking for subscription checkout initiation, subscription started (demo and Stripe webhook), plan changes, cancellations, and payment failures
- **`dashboard/views.py`**: Added event tracking for project creation, update, and deletion
- **`.env`**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written with correct values

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan (demo or Stripe) | `billing/views.py` |
| `subscription_checkout_initiated` | Fired when a user initiates a Stripe checkout session | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `subscription_payment_failed` | Fired via webhook when a payment fails (server-side) | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates a project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We recommend building an **Analytics basics** dashboard in PostHog with these five insights to keep an eye on user behavior:

1. **Registration → Subscription Conversion Funnel** — Track what fraction of new registrants go on to start a paid subscription (use `user_registered` → `subscription_started` funnel, 14-day window)
2. **New User Registrations Over Time** — Trend of `user_registered` events over the last 30 days
3. **Subscription Cancellations & Payment Failures** — Trend of `subscription_canceled` + `subscription_payment_failed` events (churn signal)
4. **Checkout → Subscription Started Funnel** — Track payment completion rate from `subscription_checkout_initiated` → `subscription_started` (7-day window)
5. **Project Activity** — Trend of `project_created`, `project_updated`, `project_deleted` events as a proxy for user engagement

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
