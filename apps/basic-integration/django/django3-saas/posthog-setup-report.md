<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The following changes were made:

- **`requirements.txt`** — added `posthog` dependency
- **`.env`** — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`
- **`config/settings.py`** — added `POSTHOG_PROJECT_TOKEN`/`POSTHOG_HOST` settings, updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`, and added `PosthogContextMiddleware` to `MIDDLEWARE`
- **`accounts/apps.py`** *(new)* — initializes the PostHog SDK in `AccountsConfig.ready()` and registers a shutdown hook
- **`accounts/views.py`** — instruments `user_registered`, `user_logged_in`, `user_logged_out`, and `profile_updated` events with full user identification
- **`billing/views.py`** — instruments `checkout_initiated`, `subscription_started`, `subscription_canceled`, `plan_changed`, and `payment_failed` events, including the Stripe webhook handlers
- **`dashboard/views.py`** — instruments `project_created` and `project_deleted` events

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | A new user completed registration and their account was created | `accounts/views.py` |
| `user_logged_in` | An existing user successfully authenticated and started a session | `accounts/views.py` |
| `user_logged_out` | A user ended their session by logging out | `accounts/views.py` |
| `profile_updated` | A user saved changes to their profile settings | `accounts/views.py` |
| `checkout_initiated` | A user started a Stripe checkout session to subscribe to a paid plan | `billing/views.py` |
| `subscription_started` | A subscription was successfully activated (demo mode or after Stripe checkout) | `billing/views.py` |
| `subscription_canceled` | A user canceled their active subscription | `billing/views.py` |
| `plan_changed` | A user switched from one subscription plan to another | `billing/views.py` |
| `payment_failed` | A recurring subscription payment failed, moving the subscription to past_due | `billing/views.py` |
| `project_created` | A user created a new project in their workspace | `dashboard/views.py` |
| `project_deleted` | A user permanently deleted a project from their workspace | `dashboard/views.py` |

## Next steps

We've suggested five key insights for an "Analytics basics" dashboard. Create these in PostHog to monitor user behavior:

1. **[Signup → Subscription funnel](/insights/new?insight=FUNNELS)** — Funnel with steps `user_registered` → `subscription_started` to measure how many new signups convert to paying customers.
2. **[New registrations over time](/insights/new?insight=TRENDS)** — Trend of `user_registered` events to track user growth.
3. **[Subscription starts & cancellations](/insights/new?insight=TRENDS)** — Trend comparing `subscription_started` vs `subscription_canceled` to monitor revenue health.
4. **[Project creation activity](/insights/new?insight=TRENDS)** — Trend of `project_created` events as a proxy for engaged, active users.
5. **[Payment failures over time](/insights/new?insight=TRENDS)** — Trend of `payment_failed` events to watch for billing issues.

View your [PostHog project dashboard](/dashboard/1119959).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
