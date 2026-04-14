<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS project. The following changes were made:

- **`requirements.txt`** — Added `posthog` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`accounts/apps.py`** — Created `AccountsConfig` with a `ready()` method that initializes the PostHog SDK on Django startup using settings from environment variables.
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings read from environment variables; registered `AccountsConfig` in `INSTALLED_APPS`; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic request context extraction.
- **`accounts/views.py`** — Added user identification and event tracking for login, logout, registration, and settings updates.
- **`billing/views.py`** — Added event tracking for subscription checkout initiation, subscription activation (both demo and Stripe), plan changes, subscription cancellations, and payment failures (server-side webhook handler).
- **`dashboard/views.py`** — Added event tracking for project creation, update, and deletion.

| Event | Description | File |
|---|---|---|
| `user_registered` | User completes registration | `accounts/views.py` |
| `user_logged_in` | User successfully logs in | `accounts/views.py` |
| `user_logged_out` | User logs out | `accounts/views.py` |
| `settings_updated` | User updates their profile settings | `accounts/views.py` |
| `subscription_checkout_initiated` | User starts a Stripe checkout session | `billing/views.py` |
| `subscription_started` | Subscription is successfully activated | `billing/views.py` |
| `subscription_canceled` | User cancels their subscription | `billing/views.py` |
| `plan_changed` | User changes their subscription plan | `billing/views.py` |
| `project_created` | User creates a new project | `dashboard/views.py` |
| `project_updated` | User updates a project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |
| `payment_failed` | Stripe payment fails (webhook) | `billing/views.py` |

## Next steps

Visit your [PostHog project](https://us.i.posthog.com/project/2) to view incoming events once users interact with the app. We recommend creating an **"Analytics basics"** dashboard with these insights:

1. **Registration → Subscription funnel** — Funnel: `user_registered` → `subscription_checkout_initiated` → `subscription_started`
2. **New registrations over time** — Trend: `user_registered` (daily)
3. **Active users** — Trend: `user_logged_in` (unique users, weekly)
4. **Subscription churn** — Trend: `subscription_canceled` vs `subscription_started`
5. **Project activity** — Trend: `project_created`, `project_updated`, `project_deleted` (stacked)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
