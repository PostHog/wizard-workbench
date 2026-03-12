<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog` package dependency.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings (from environment variables), registered `PosthogContextMiddleware`, and updated `accounts` app reference to `accounts.apps.AccountsConfig`.
- **`config/posthog_client.py`** — New module exposing the shared `Posthog()` instance, initialized at startup.
- **`accounts/apps.py`** — New `AccountsConfig` with `ready()` that initializes the `Posthog(enable_exception_autocapture=True)` instance and registers `atexit` shutdown.
- **`accounts/views.py`** — Added `user_registered`, `user_logged_in`, `user_logged_out`, and `profile_updated` event capture, plus user identification (`identify_context`) with `tag()` for person properties on login/register.
- **`billing/views.py`** — Added `checkout_initiated`, `subscription_started`, `checkout_completed`, `subscription_changed`, `subscription_canceled`, and `payment_failed` events across Stripe checkout, webhook, and demo-mode subscription flows.
- **`dashboard/views.py`** — Added `project_created` and `project_deleted` events for feature adoption and churn signal tracking.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | New user completes registration | `accounts/views.py` |
| `user_logged_in` | Existing user successfully logs in | `accounts/views.py` |
| `user_logged_out` | User logs out of their session | `accounts/views.py` |
| `profile_updated` | User updates profile/account settings | `accounts/views.py` |
| `checkout_initiated` | User initiates a Stripe checkout session | `billing/views.py` |
| `subscription_started` | User subscribes to a plan (demo or Stripe) | `billing/views.py` |
| `checkout_completed` | Stripe checkout webhook — subscription created | `billing/views.py` |
| `subscription_changed` | User changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | User cancels their subscription | `billing/views.py` |
| `payment_failed` | Payment attempt fails (Stripe webhook) | `billing/views.py` |
| `project_created` | User creates a new project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Registration → Activation Funnel** — Funnel: `user_registered` → `project_created` → `subscription_started`
2. **Subscription Conversions** — Trends: `subscription_started` over time
3. **Churn Signals** — Trends: `subscription_canceled` + `payment_failed` over time
4. **Project Activity** — Trends: `project_created` + `project_deleted` over time
5. **Authentication Volume** — Trends: `user_registered` + `user_logged_in` over time

Visit [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights) to create these insights and save them to a new dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
