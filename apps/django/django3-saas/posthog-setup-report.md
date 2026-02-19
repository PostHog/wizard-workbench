<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. Here's a summary of every change made:

- **`requirements.txt`** — Added `posthog` as a dependency.
- **`.env`** — Created with `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables (covered by `.gitignore`).
- **`config/settings.py`** — Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings (read from environment variables). Added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` (auto-extracts tracing headers and captures exceptions). Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`.
- **`accounts/apps.py`** — Created `AccountsConfig` with `ready()` that initialises the PostHog SDK once at startup using settings values, enables debug mode in development, and respects `POSTHOG_DISABLED`.
- **`accounts/views.py`** — Added `user_logged_in` (via `CustomLoginView.form_valid`), `user_logged_out` (via `CustomLogoutView.dispatch`), `user_registered` (in `register`), and `profile_updated` (in `settings`). All events use `new_context()` + `identify_context()` + `tag()` for person properties.
- **`billing/views.py`** — Added `subscription_initiated` (on POST in `subscribe`), `subscription_created` (demo mode and Stripe webhook `_handle_checkout_completed`), `plan_changed` (`change_plan`), `subscription_canceled` (`cancel`), and `payment_failed` (`_handle_payment_failed`). Added `posthog.capture_exception()` around Stripe API calls.
- **`dashboard/views.py`** — Added `project_created`, `project_updated`, and `project_deleted` with contextual properties (project ID, name, active state, total project count).

## Events table

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in via the custom login view | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile/account settings | `accounts/views.py` |
| `subscription_initiated` | Fired when a user submits the subscribe form (before redirecting to Stripe or creating demo subscription) | `billing/views.py` |
| `subscription_created` | Fired after checkout.session.completed webhook (Stripe) or immediately in demo mode, confirming payment success | `billing/views.py` |
| `plan_changed` | Fired when a user successfully upgrades or downgrades their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription — key churn signal | `billing/views.py` |
| `payment_failed` | Fired inside the Stripe webhook handler when an invoice payment fails | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project — core feature usage event | `dashboard/views.py` |
| `project_updated` | Fired when a user saves edits to an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user permanently deletes a project | `dashboard/views.py` |

## Next steps

We recommend building the following insights and a dashboard in your PostHog project to monitor the most critical user behaviors. You can create these at [https://us.posthog.com](https://us.posthog.com):

**Suggested "Analytics basics" dashboard — 5 recommended insights:**

1. **New user signups** — Trend on `user_registered` over time
2. **Subscription conversion funnel** — Funnel: `subscription_initiated` → `subscription_created`
3. **Churn tracking** — Trend on `subscription_canceled` over time
4. **Core feature usage** — Trend on `project_created` over time
5. **Payment health** — Trend on `payment_failed` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
