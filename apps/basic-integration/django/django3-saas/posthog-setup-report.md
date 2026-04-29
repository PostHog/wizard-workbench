<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. PostHog is initialized via `accounts/apps.py` using Django's `AppConfig.ready()` hook, so the SDK is configured once at startup and available throughout the app. The `PosthogContextMiddleware` is added to `MIDDLEWARE` to automatically wrap every request with a context, extract session/distinct-ID headers from the frontend, capture the current URL and request method, and auto-capture exceptions for error tracking.

Event tracking has been added across authentication, billing, and project management flows. Each event uses `with posthog.new_context():` with `posthog.identify_context(str(user.id))` to tie server-side events to the correct user. Person properties (username, date_joined) are set via `posthog.tag()` at login and registration. PII is never sent in `capture()` event properties.

**Files changed:**

| File | Change |
|---|---|
| `requirements.txt` | Added `posthog` dependency |
| `config/settings.py` | Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST` settings; registered `accounts.apps.AccountsConfig`; added `PosthogContextMiddleware` |
| `accounts/apps.py` | Created — initializes PostHog SDK on startup via `AppConfig.ready()`, registers `posthog.shutdown` with `atexit` |
| `accounts/views.py` | Added events for login, logout, registration, and profile updates |
| `billing/views.py` | Added events for pricing viewed, checkout initiated, subscription started, subscription canceled, plan changed, checkout completed (webhook), and payment failed (webhook) |
| `dashboard/views.py` | Added events for project created, updated, and deleted |
| `.env` | Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

**Events instrumented:**

| Event | Description | File |
|---|---|---|
| `user_registered` | New user completes registration | `accounts/views.py` |
| `user_logged_in` | User logs in successfully | `accounts/views.py` |
| `user_logged_out` | User logs out | `accounts/views.py` |
| `profile_updated` | User saves profile/settings changes | `accounts/views.py` |
| `pricing_viewed` | User views the pricing page (top of funnel) | `billing/views.py` |
| `checkout_initiated` | Stripe checkout session created | `billing/views.py` |
| `subscription_started` | Subscription created (demo mode) | `billing/views.py` |
| `subscription_canceled` | User cancels their subscription | `billing/views.py` |
| `plan_changed` | User changes their subscription plan | `billing/views.py` |
| `checkout_completed` | Stripe webhook confirms successful checkout | `billing/views.py` |
| `payment_failed` | Stripe webhook reports failed invoice payment | `billing/views.py` |
| `project_created` | User creates a new project | `dashboard/views.py` |
| `project_updated` | User edits and saves a project | `dashboard/views.py` |
| `project_deleted` | User deletes a project | `dashboard/views.py` |

## Next steps

Head to your PostHog project to build insights from these events. Here are five recommended insights to create in an **"Analytics basics"** dashboard:

1. **Registration-to-subscription funnel** — Funnel insight with steps: `user_registered` → `checkout_initiated` → `subscription_started` / `checkout_completed`. Shows your conversion rate from signup to paid.

2. **New user signups over time** — Trend insight for `user_registered` by day. Your primary growth metric.

3. **Subscription churn** — Trend insight for `subscription_canceled` and `payment_failed`. Monitor churn signals over time.

4. **Project activity** — Trend insight for `project_created`, `project_updated`, `project_deleted` grouped together. Measures user engagement depth.

5. **Pricing page conversion** — Funnel insight with steps: `pricing_viewed` → `checkout_initiated` → `checkout_completed`. Shows how well your pricing page converts visitors.

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
