# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS application. The posthog Python SDK has been installed, the `PosthogContextMiddleware` has been added to automatically wrap every request with session context, and PostHog is initialized in `AccountsConfig.ready()` so it is ready before any view is invoked. Twelve server-side events now cover the full user lifecycle — from registration and login through subscription billing and project management — with user identification on all authentication events so backend and frontend activity can be correlated.

## Changes summary

| File | What changed |
|---|---|
| `requirements.txt` | Added `posthog` dependency |
| `config/settings.py` | Added `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST` settings; registered `accounts.apps.AccountsConfig` in `INSTALLED_APPS`; added `PosthogContextMiddleware` to `MIDDLEWARE` |
| `accounts/apps.py` | New file — initializes PostHog (`api_key`, `host`) in `AccountsConfig.ready()` |
| `accounts/views.py` | Added `user_logged_in`, `user_logged_out`, `user_registered`, `profile_updated` events with `identify_context()` on auth flows |
| `billing/views.py` | Added `subscription_checkout_initiated`, `subscription_started`, `subscription_changed`, `subscription_canceled`, `payment_failed` events including Stripe webhook handlers |
| `dashboard/views.py` | Added `project_created`, `project_updated`, `project_deleted` events |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully authenticates | `accounts/views.py` |
| `user_logged_out` | Fired when an authenticated user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves profile settings changes | `accounts/views.py` |
| `subscription_checkout_initiated` | Fired when a user begins the Stripe checkout flow | `billing/views.py` |
| `subscription_started` | Fired when a subscription is successfully activated | `billing/views.py` |
| `subscription_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when an invoice payment fails | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user saves edits to a project | `dashboard/views.py` |
| `project_deleted` | Fired when a user permanently deletes a project | `dashboard/views.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to keep an eye on user behavior:

1. **User registrations over time** — Trends chart on `user_registered` — spot growth spikes and drops.
2. **Registration → subscription funnel** — Funnel from `user_registered` → `subscription_started` — measures paid conversion rate.
3. **Subscription churn** — Trends chart on `subscription_canceled` and `payment_failed` — monitor churn signals.
4. **Active project usage** — Trends chart with `project_created`, `project_updated`, `project_deleted` — measures product engagement depth.
5. **Login activity** — Trends chart on `user_logged_in` — a proxy for daily/weekly active users.

[Open PostHog Dashboards](/dashboard) to create the "Analytics basics" dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
