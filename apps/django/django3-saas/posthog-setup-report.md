<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK is initialized via `AccountsConfig.ready()` in `accounts/apps.py`, and the `PosthogContextMiddleware` is registered in `config/settings.py` to automatically extract tracing headers and exception context for every request. Event tracking has been added to the accounts, billing, and dashboard apps to cover the full user lifecycle — from registration and login through subscription management and project activity.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when an existing user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when an authenticated user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan in demo mode | `billing/views.py` |
| `checkout_initiated` | Fired when a user is redirected to Stripe Checkout | `billing/views.py` |
| `checkout_completed` | Fired via Stripe webhook when checkout.session.completed is received | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when invoice.payment_failed is received | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

To monitor user behavior with these events, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Registration → Subscription funnel** — Funnel from `user_registered` → `checkout_initiated` → `checkout_completed`. Shows where users drop off in the conversion flow.

2. **Subscription cancellations over time** — Trends chart for `subscription_canceled`, broken down by `plan_name`. Helps identify which plans churn most.

3. **Payment failures** — Trends chart for `payment_failed`. Critical for spotting billing issues early.

4. **Project creation rate** — Trends chart for `project_created` per unique user. A key engagement signal — users who create projects are retained users.

5. **Active users by plan** — Retention or trends chart grouping `user_logged_in` events by the user's plan tier (requires a person property set on subscription start).

You can build these in your PostHog project at https://us.i.posthog.com.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
