<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The PostHog Python SDK has been installed, configured, and wired into all key user-facing and billing flows.

## Changes made

- **`requirements.txt`** — added `posthog` dependency
- **`config/settings.py`** — added `POSTHOG_API_KEY` / `POSTHOG_HOST` settings from env vars, changed `'accounts'` to `'accounts.apps.AccountsConfig'` in `INSTALLED_APPS`, added `PosthogContextMiddleware` to `MIDDLEWARE`
- **`accounts/apps.py`** *(new)* — `AccountsConfig.ready()` initialises the PostHog SDK on startup
- **`.env`** — `POSTHOG_API_KEY` and `POSTHOG_HOST` written
- **`accounts/views.py`** — added `user_registered`, `user_logged_in`, and `profile_updated` events
- **`billing/views.py`** — added `checkout_session_created`, `subscription_started`, `subscription_created`, `plan_changed`, `subscription_canceled`, and `payment_failed` events
- **`dashboard/views.py`** — added `project_created`, `project_updated`, and `project_deleted` events

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | User completed registration and was logged in | `accounts/views.py` |
| `user_logged_in` | User logged in via the login form | `accounts/views.py` |
| `profile_updated` | User saved changes to their profile/settings | `accounts/views.py` |
| `subscription_started` | User subscribed to a plan in demo mode | `billing/views.py` |
| `checkout_session_created` | User redirected to Stripe Checkout | `billing/views.py` |
| `subscription_created` | Stripe webhook confirmed successful checkout | `billing/views.py` |
| `plan_changed` | User changed their subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their subscription | `billing/views.py` |
| `payment_failed` | Stripe webhook reported a failed payment | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User edited an existing project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following recommended insights to track business health:

1. **User registrations over time** — Trend of `user_registered` events; shows top-of-funnel growth
2. **Subscription conversion funnel** — Funnel from `user_registered` → `checkout_session_created` (or `subscription_started`) → `subscription_created`; reveals where users drop off
3. **Subscription cancellations** — Trend of `subscription_canceled` events; key churn signal
4. **Plan change activity** — Breakdown of `plan_changed` events by `plan_slug` property; shows upgrade/downgrade patterns
5. **Payment failures** — Trend of `payment_failed` events; tracks billing health

You can build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
