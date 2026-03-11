<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The Python SDK (`posthog` 7.9.10) was installed, and event tracking was added across all major user flows: authentication, billing, and project management. The integration uses the context API pattern (`new_context()` / `identify_context()`) as recommended for Django server-side tracking, with the `PosthogContextMiddleware` automatically attaching session and request metadata to all events.

## Files changed

| File | Change |
|------|--------|
| `requirements.txt` | Added `posthog` dependency |
| `accounts/apps.py` | Created `AccountsConfig` — initializes PostHog SDK in `ready()` with API key and host from environment variables |
| `config/settings.py` | Added `accounts.apps.AccountsConfig` to `INSTALLED_APPS`, added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`, added `POSTHOG_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings |
| `accounts/views.py` | Added PostHog event capture for login, logout, registration, and profile updates |
| `billing/views.py` | Added PostHog event capture for checkout initiation, subscription start (demo mode), plan changes, subscription cancellation, webhook-triggered checkout completion, and payment failures |
| `dashboard/views.py` | Added PostHog event capture for project creation, project updates, and project deletion |
| `.env` | Added `POSTHOG_KEY` and `POSTHOG_HOST` environment variables |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user successfully completes registration and is logged in | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of their account | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their account settings/profile | `accounts/views.py` |
| `subscription_started` | Fired when a user successfully subscribes to a plan (demo mode) | `billing/views.py` |
| `checkout_initiated` | Fired when a user is redirected to Stripe Checkout to begin payment | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription | `billing/views.py` |
| `plan_changed` | Fired when a user successfully changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Fired server-side in the Stripe webhook handler when `checkout.session.completed` is received | `billing/views.py` |
| `payment_failed` | Fired server-side in the Stripe webhook handler when `invoice.payment_failed` is received | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user successfully edits an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user permanently deletes a project | `dashboard/views.py` |

## Next steps

To build analytics insights in PostHog, visit your project and create an "Analytics basics" dashboard with these recommended insights:

1. **Signup & Login Trends** — Trends chart for `user_registered` and `user_logged_in` events (daily, last 30 days)
2. **Subscription Conversion Funnel** — Funnel: `user_registered` → `checkout_initiated` → `checkout_completed`
3. **Subscription Revenue Events** — Trends chart for `checkout_completed` and `subscription_started`
4. **Churn Signals** — Trends chart for `subscription_canceled` and `payment_failed`
5. **Project Engagement** — Trends chart for `project_created`, `project_updated`, `project_deleted`

Navigate to: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
