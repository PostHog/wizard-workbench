<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Django SaaS project with PostHog analytics. The following changes were made:

- **`accounts/apps.py`** (new): `AccountsConfig.ready()` initializes the PostHog SDK using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables, so PostHog is available throughout the application.
- **`config/settings.py`**: Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` settings; added `posthog.integrations.django.PosthogContextMiddleware` to `MIDDLEWARE` for automatic request context and exception capture; updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`.
- **`requirements.txt`**: Added `posthog` dependency.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **`accounts/views.py`**: Added PostHog event capture for user registration, login (via `CustomLoginView.form_valid`), logout (via `CustomLogoutView.dispatch`), and profile settings updates. Users are identified on login and registration using `identify_context`.
- **`billing/views.py`**: Added PostHog event capture for subscription started (both Stripe and demo modes), plan changed, subscription canceled, checkout completed (webhook handler), and payment failed (webhook handler). Exception capture added around Stripe API error paths.
- **`dashboard/views.py`**: Added PostHog event capture for project created, project updated, and project deleted.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user initiates a subscription (demo mode or Stripe redirect) | `billing/views.py` |
| `subscription_checkout_completed` | Fired server-side when Stripe checkout.session.completed webhook is received | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired server-side when a Stripe invoice.payment_failed webhook is received | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup → Subscription funnel** — Funnel from `user_registered` → `subscription_started` → `subscription_checkout_completed`. Tracks your top-of-funnel conversion rate.
   - [Create this insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Subscription cancellation rate** — Trend of `subscription_canceled` over time, optionally broken down by `plan_name`. Key churn metric.
   - [Create this insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Payment failures** — Trend of `payment_failed` over time. Alerts you to billing health issues.
   - [Create this insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Project activity** — Trend of `project_created`, `project_updated`, and `project_deleted` stacked. Measures product engagement depth.
   - [Create this insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **User retention** — Retention from `user_registered` returning with `user_logged_in`. Shows how well you retain newly registered users.
   - [Create this insight](https://us.posthog.com/project/2/insights/new?insight=RETENTION)

You can create a new dashboard and add all five at:
👉 [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
