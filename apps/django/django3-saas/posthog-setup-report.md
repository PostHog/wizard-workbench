<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The `posthog` Python SDK (v7.9.12) was installed and configured with server-side event tracking across the authentication, billing, and dashboard flows.

**Changes made:**

- **`requirements.txt`** — Added `posthog` dependency
- **`config/settings.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` settings from environment variables; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE`; updated `accounts` entry to `accounts.apps.AccountsConfig`
- **`accounts/apps.py`** *(new)* — `AccountsConfig.ready()` initializes the PostHog SDK with `api_key`, `host`, `enable_exception_autocapture=True`, and registers `posthog.shutdown` with `atexit`
- **`accounts/views.py`** — Added `user_logged_in` (on `CustomLoginView.form_valid`), `user_logged_out` (on `CustomLogoutView.dispatch`), `user_registered` (on successful registration), and `settings_updated` events; user identity set via `identify_context` + `tag` on login and registration
- **`billing/views.py`** — Added `pricing_viewed`, `checkout_initiated`, `subscription_started`, `subscription_completed`, `plan_changed`, `subscription_canceled`, and `payment_failed` events
- **`dashboard/views.py`** — Added `project_created` and `project_deleted` events
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `user_registered` | User created a new account | `accounts/views.py` |
| `user_logged_in` | User authenticated and logged in | `accounts/views.py` |
| `user_logged_out` | User ended their session | `accounts/views.py` |
| `settings_updated` | User updated their profile settings | `accounts/views.py` |
| `pricing_viewed` | Authenticated user viewed pricing page (top of funnel) | `billing/views.py` |
| `checkout_initiated` | User started a Stripe checkout session | `billing/views.py` |
| `subscription_started` | User subscribed in demo mode | `billing/views.py` |
| `subscription_completed` | Stripe webhook confirmed subscription created | `billing/views.py` |
| `plan_changed` | User changed subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their subscription | `billing/views.py` |
| `payment_failed` | Stripe payment attempt failed | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |

## Next steps

We were unable to create the "Analytics basics" dashboard automatically because the available API key lacks `dashboard:write` and `insight:write` scopes. You can build it manually in PostHog using the events above. Recommended insights:

1. **Signup → Subscription conversion funnel** — Funnel: `user_registered` → `pricing_viewed` → `checkout_initiated` / `subscription_started` → `subscription_completed`
2. **Subscription cancellation rate** — Trend: `subscription_canceled` over time; break down by `plan_slug`
3. **Payment failures** — Trend: `payment_failed` over time; useful for monitoring billing health
4. **Project engagement** — Trend: `project_created` and `project_deleted` per user over time
5. **Daily active users (login activity)** — Trend: `user_logged_in` unique users per day

You can create all of these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
