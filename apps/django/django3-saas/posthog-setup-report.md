<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS project. The Python SDK was installed and configured to initialize via `accounts/apps.py` using Django's `AppConfig.ready()` lifecycle hook. The `PosthogContextMiddleware` was added to automatically extract session/user context on every request. Event tracking was added across three core areas: user authentication flows, subscription/billing operations, and project management actions.

## Files changed

| File | Change |
|------|--------|
| `requirements.txt` | Added `posthog` dependency |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |
| `config/settings.py` | Added PostHog settings (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `POSTHOG_DISABLED`), updated `INSTALLED_APPS` to use `AccountsConfig`, added `PosthogContextMiddleware` to `MIDDLEWARE` |
| `accounts/apps.py` | Created — initializes PostHog SDK in `ready()` |
| `accounts/views.py` | Added event tracking for login, logout, registration, profile updates |
| `billing/views.py` | Added event tracking for pricing views, subscriptions, plan changes, cancellations, payment failures |
| `dashboard/views.py` | Added event tracking for project creation and deletion |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | A new user completed registration via email | `accounts/views.py` |
| `user_logged_in` | A user successfully logged in | `accounts/views.py` |
| `user_logged_out` | A user logged out of the application | `accounts/views.py` |
| `profile_updated` | A user updated their profile/account settings | `accounts/views.py` |
| `pricing_viewed` | A visitor viewed the pricing page (top of conversion funnel) | `billing/views.py` |
| `subscription_started` | A user started a new subscription (demo or via Stripe) | `billing/views.py` |
| `subscription_plan_changed` | A user changed their subscription plan (upgrade or downgrade) | `billing/views.py` |
| `subscription_canceled` | A user canceled their subscription | `billing/views.py` |
| `payment_failed` | A Stripe payment failed for a subscription | `billing/views.py` |
| `project_created` | A user created a new project | `dashboard/views.py` |
| `project_deleted` | A user deleted a project (churn signal) | `dashboard/views.py` |

## Next steps

Once events start flowing, head to your PostHog project and build an **"Analytics basics"** dashboard with these recommended insights:

1. **Signup conversion funnel** — `pricing_viewed` → `user_registered` → `subscription_started`
2. **Daily/weekly new registrations** — Trend of `user_registered` over time
3. **Subscription cancellation rate** — `subscription_canceled` vs `subscription_started` over time
4. **Payment failure trend** — Trend of `payment_failed` (churn warning signal)
5. **Project engagement** — Trend of `project_created` vs `project_deleted` (engagement health)

Navigate to **https://us.i.posthog.com/project/2/dashboards** to create these.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
