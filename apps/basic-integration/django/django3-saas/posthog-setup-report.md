<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`accounts/apps.py`** (created): `AccountsConfig.ready()` initialises the PostHog Python SDK once at startup, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings; registered `posthog.integrations.django.PosthogContextMiddleware` in `MIDDLEWARE`; switched `accounts` to `accounts.apps.AccountsConfig` in `INSTALLED_APPS`.
- **`requirements.txt`**: Added `posthog` package.
- **`.env`**: Populated `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- **`accounts/views.py`**: Added user identification and event tracking for login, logout, registration, and profile updates.
- **`billing/views.py`**: Added event tracking for pricing page views, Stripe checkout initiation, subscription starts (both demo and Stripe webhook), plan changes, and cancellations. Added `posthog.capture_exception()` around Stripe error paths.
- **`dashboard/views.py`**: Added event tracking for dashboard views, project creation, project updates, and project deletion.

All events use the context API pattern (`new_context()` / `identify_context()` / `capture()`) so that user identity is reliably linked to every event. The `PosthogContextMiddleware` automatically extracts tracing headers from the frontend PostHog JS SDK if it is added later.

| Event | Description | File |
|---|---|---|
| `user_registered` | User successfully created a new account | `accounts/views.py` |
| `user_logged_in` | User successfully authenticated and logged in | `accounts/views.py` |
| `user_logged_out` | User logged out of their account | `accounts/views.py` |
| `profile_updated` | User updated their profile settings | `accounts/views.py` |
| `pricing_viewed` | User viewed the pricing page | `billing/views.py` |
| `checkout_initiated` | User was redirected to Stripe Checkout | `billing/views.py` |
| `subscription_started` | User successfully subscribed to a plan | `billing/views.py` |
| `plan_changed` | User switched to a different subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their active subscription | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User updated an existing project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |
| `dashboard_viewed` | User loaded their main dashboard | `dashboard/views.py` |

## Next steps

To build the recommended "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboard) and create a new dashboard with these five insights:

1. **New User Registrations** — Trends insight on `user_registered`, last 30 days. Shows growth rate.
2. **Subscription Conversion Funnel** — Funnel insight: `pricing_viewed` → `checkout_initiated` → `subscription_started`. Shows where users drop off in the purchase flow.
3. **Subscription Cancellations** — Trends insight on `subscription_canceled`, last 30 days. Key churn signal.
4. **Project Activity** — Trends insight with both `project_created` and `project_deleted` as separate series. Shows engagement depth.
5. **Daily Active Users** — Trends insight on `dashboard_viewed` with unique users aggregation, last 30 days. Core engagement metric.

You can also explore all tracked events in [Data Management → Events](/data-management/events).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
