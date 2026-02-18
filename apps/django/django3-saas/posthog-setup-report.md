<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`accounts/apps.py`** (new file): Created `AccountsConfig` with a `ready()` method that initialises the PostHog Python SDK once at Django startup, reading `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables.
- **`config/settings.py`**: Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings read from environment variables. Registered `posthog.integrations.django.PosthogContextMiddleware` in `MIDDLEWARE` (automatically extracts session/user tracing headers and captures exceptions). Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`.
- **`accounts/views.py`**: Added PostHog event tracking for user authentication and profile management.
- **`billing/views.py`**: Added PostHog event tracking for subscription lifecycle and Stripe webhook events.
- **`dashboard/views.py`**: Added PostHog event tracking for project CRUD operations.
- **`.env`**: Added `POSTHOG_API_KEY` and `POSTHOG_HOST` values.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user completes registration | `accounts/views.py` |
| `user_logged_in` | User successfully logs in | `accounts/views.py` |
| `user_logged_out` | User logs out | `accounts/views.py` |
| `profile_updated` | User updates their profile/settings | `accounts/views.py` |
| `subscription_started` | User subscribes to a plan (demo mode) | `billing/views.py` |
| `subscription_canceled` | User cancels their subscription | `billing/views.py` |
| `plan_changed` | User changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Stripe checkout.session.completed webhook received | `billing/views.py` |
| `payment_failed` | Stripe invoice.payment_failed webhook received | `billing/views.py` |
| `project_created` | User creates a new project | `dashboard/views.py` |
| `project_updated` | User edits an existing project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |

## Next steps

We were unable to auto-create the PostHog dashboard because the API key provided does not have `dashboard:write` / `insight:write` scopes. To create the recommended **"Analytics basics"** dashboard manually, visit your PostHog project and add the following insights:

1. **User Signups Over Time** — Trends on `user_signed_up`
2. **Signup → Subscription Conversion Funnel** — Funnel: `user_signed_up` → `subscription_started`
3. **Subscription Cancellations Over Time** — Trends on `subscription_canceled`
4. **Login Activity Over Time** — Trends on `user_logged_in`
5. **Project Activity** — Trends on `project_created`, `project_updated`, `project_deleted`

Your PostHog project: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
