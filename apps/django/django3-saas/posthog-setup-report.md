<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Django SaaS application. Here's a summary of everything that was set up:

**Configuration:**
- Installed `posthog` Python SDK (added to `requirements.txt`)
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env`
- Added PostHog settings to `config/settings.py`
- Added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` — this auto-extracts tracing headers and captures exceptions on every request
- Created `accounts/apps.py` with `AccountsConfig` that initializes the PostHog SDK in `AppConfig.ready()` and registers `posthog.shutdown` with `atexit` to flush events on exit
- Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`

**Event instrumentation** was added to 3 files covering the full user lifecycle — from signup through billing to project management.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully registers an account | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile/account settings | `accounts/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |
| `subscription_started` | Fired when a user successfully subscribes to a plan | `billing/views.py` |
| `subscription_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_cancelled` | Fired when a user cancels their subscription | `billing/views.py` |
| `checkout_completed` | Fired in the Stripe webhook handler when checkout completes | `billing/views.py` |
| `payment_failed` | Fired in the Stripe webhook handler when a payment fails | `billing/views.py` |

**User identification** is performed on login and registration using `identify_context()` so all events are linked to the correct user profile.

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key business metrics:

1. **Registration-to-subscription funnel** — Funnel: `user_registered` → `subscription_started`
2. **New subscriptions over time** — Trend: `subscription_started` event count per day
3. **Subscription churn rate** — Trend: `subscription_cancelled` vs `subscription_started` over time
4. **Project creation activity** — Trend: `project_created` events per day/week
5. **Payment failures** — Trend: `payment_failed` events — monitor for billing issues

Create this dashboard in your PostHog project:
- [Go to PostHog project 238460](https://us.posthog.com/project/238460/insights)
- [Create a new dashboard](https://us.posthog.com/project/238460/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
