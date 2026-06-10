<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here is a summary of all changes made:

- **`requirements.txt`** — Added `posthog` as a dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables (values written; file is `.gitignore`-covered).
- **`accounts/apps.py`** *(new file)* — Created `AccountsConfig` with a `ready()` method that initializes the PostHog SDK once at Django startup using `posthog.api_key` and `posthog.host` read from Django settings.
- **`config/settings.py`** — Registered `accounts.apps.AccountsConfig` in `INSTALLED_APPS`, appended `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`, and added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings backed by environment variables.
- **`accounts/views.py`** — Added event capture for user registration, login, logout, and profile updates, with user identification (`identify_context`) on every event.
- **`billing/views.py`** — Added event capture across the full subscription lifecycle: pricing page view, checkout initiation, subscription start (demo mode), plan changes, subscription cancellation, Stripe webhook checkout completion, and payment failures.
- **`dashboard/views.py`** — Added event capture for project creation, update, and deletion.

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completes registration and logs in for the first time | `accounts/views.py` |
| `user_logged_in` | Existing user successfully authenticates via the login form | `accounts/views.py` |
| `user_logged_out` | User ends their session by logging out | `accounts/views.py` |
| `profile_updated` | User saves changes to their account profile | `accounts/views.py` |
| `pricing_viewed` | Visitor views the pricing page — top of the subscription funnel | `billing/views.py` |
| `checkout_initiated` | User clicks subscribe and is redirected to Stripe Checkout | `billing/views.py` |
| `subscription_started` | User activates a subscription in demo mode | `billing/views.py` |
| `subscription_canceled` | User cancels their active subscription | `billing/views.py` |
| `plan_changed` | User upgrades or downgrades to a different plan | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirms a successful checkout | `billing/views.py` |
| `payment_failed` | Stripe webhook reports a failed payment | `billing/views.py` |
| `project_created` | User creates a new project inside the dashboard | `dashboard/views.py` |
| `project_updated` | User saves edits to an existing project | `dashboard/views.py` |
| `project_deleted` | User permanently deletes a project | `dashboard/views.py` |

## Next steps

To explore these events in PostHog, visit your project and navigate to **Insights** to build trend charts and funnels. Suggested analyses:

- **Signup → Pricing → Subscribe conversion funnel** using `user_registered` → `pricing_viewed` → `subscription_started` or `checkout_initiated`
- **Subscription churn** trend using `subscription_canceled` over time
- **Payment health** trend using `payment_failed` over time
- **Project engagement** trend using `project_created` and `project_updated` per user
- **User retention** using `user_logged_in` as the returning action

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
