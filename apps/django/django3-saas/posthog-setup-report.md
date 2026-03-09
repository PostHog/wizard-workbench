<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK has been installed and configured, with the `PosthogContextMiddleware` added to automatically wrap all requests with session and user context. A new `AccountsConfig` AppConfig initializes PostHog on startup via `ready()`, with a registered `atexit` handler to flush events on shutdown. Event tracking has been added to key user flows across accounts, billing, and dashboard views, using the context API pattern (`new_context()` / `identify_context()`) to ensure all events are correctly attributed to authenticated users.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully registers an account | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan (demo or Stripe checkout) | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Fired from the Stripe webhook when a checkout session completes | `billing/views.py` |
| `payment_failed` | Fired from the Stripe webhook when a payment fails | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Files changed

- **`requirements.txt`** — Added `posthog` dependency
- **`config/settings.py`** — Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED` settings; added `PosthogContextMiddleware`; updated `accounts` app reference to `accounts.apps.AccountsConfig`
- **`accounts/apps.py`** — New file: `AccountsConfig` with PostHog initialization in `ready()`
- **`accounts/views.py`** — Added `user_signed_up`, `user_logged_in` (with identify), `user_logged_out`, `profile_updated` events
- **`billing/views.py`** — Added `subscription_started`, `subscription_canceled`, `subscription_plan_changed`, `checkout_completed`, `payment_failed` events; added `capture_exception` on Stripe errors
- **`dashboard/views.py`** — Added `project_created`, `project_updated`, `project_deleted` events
- **`.env`** — Set `POSTHOG_KEY` and `POSTHOG_HOST`

## Next steps

To view your analytics, log in to your PostHog project and create a dashboard with these suggested insights:

- **User signup trend** — Trend of `user_signed_up` over time
- **Login-to-subscription conversion funnel** — Funnel: `user_signed_up` → `subscription_started` → `checkout_completed`
- **Subscription churn** — Trend of `subscription_canceled` over time
- **Project activity** — Trend of `project_created`, `project_updated`, `project_deleted`
- **Payment failures** — Trend of `payment_failed` to monitor billing health

You can find your project at https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
