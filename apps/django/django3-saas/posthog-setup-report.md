<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — Added the `posthog` package dependency.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings (read from environment variables), registered `accounts.apps.AccountsConfig` as the app config, and added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic request context and exception tracking.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **`accounts/apps.py`** — New file. `AccountsConfig.ready()` initializes PostHog with the project token and host at startup and registers `posthog.shutdown` with `atexit` to flush events on exit.
- **`accounts/views.py`** — Added `user_registered`, `user_logged_in`, `user_logged_out`, and `profile_updated` events with user identification via `identify_context()`.
- **`billing/views.py`** — Added `subscription_started`, `subscription_canceled`, `plan_changed`, `checkout_completed`, and `payment_failed` events, plus `posthog.capture_exception()` calls around billing error boundaries.
- **`dashboard/views.py`** — Added `project_created`, `project_updated`, and `project_deleted` events.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration successfully. | `accounts/views.py` |
| `user_logged_in` | Fired when a user logs in successfully. Used to identify users. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out. | `accounts/views.py` |
| `profile_updated` | Fired when a user saves their profile/account settings. | `accounts/views.py` |
| `subscription_started` | Fired when a user initiates a subscription (demo or Stripe). | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription. | `billing/views.py` |
| `plan_changed` | Fired when a user changes from one subscription plan to another. | `billing/views.py` |
| `checkout_completed` | Server-side: Fired when Stripe checkout.session.completed webhook is received. | `billing/views.py` |
| `payment_failed` | Server-side: Fired when Stripe invoice.payment_failed webhook is received. | `billing/views.py` |
| `project_created` | Fired when a user creates a new project. | `dashboard/views.py` |
| `project_updated` | Fired when a user edits an existing project. | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project. | `dashboard/views.py` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup → Subscription conversion funnel** — Funnel: `user_registered` → `subscription_started` → `checkout_completed`
2. **New user registrations over time** — Trend: `user_registered`
3. **Subscription activity** — Trend: `subscription_started`, `subscription_canceled`, `plan_changed`
4. **Project engagement** — Trend: `project_created`, `project_updated`, `project_deleted`
5. **Payment failures** — Trend: `payment_failed`

Visit your PostHog project to create these: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
