<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK has been installed, initialized via `AccountsConfig.ready()`, and event tracking has been added across three key areas of the application: authentication (`accounts/views.py`), billing (`billing/views.py`), and project management (`dashboard/views.py`). The `PosthogContextMiddleware` was added to `MIDDLEWARE` in `config/settings.py` to automatically extract session and user context from every request. PostHog settings (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) are read from environment variables, which have been written to `.env`.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration and their account is created | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of the application | `accounts/views.py` |
| `profile_updated` | Fired when a user saves changes to their profile settings | `accounts/views.py` |
| `subscription_started` | Fired when a user initiates a new subscription (Stripe checkout or demo mode) | `billing/views.py` |
| `checkout_completed` | Fired server-side when Stripe confirms a `checkout.session.completed` webhook event | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription | `billing/views.py` |
| `payment_failed` | Fired server-side when Stripe sends an `invoice.payment_failed` webhook event | `billing/views.py` |
| `project_created` | Fired when a user successfully creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user saves changes to an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user permanently deletes a project | `dashboard/views.py` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior and business health:

1. **Signup → Subscription conversion funnel** — `user_registered` → `subscription_started` → `checkout_completed`. This funnel reveals how effectively new registrations convert to paying customers.
2. **New registrations over time** — A trend chart for `user_registered`. Track daily/weekly acquisition.
3. **Subscription cancellations over time** — A trend chart for `subscription_canceled`. Monitor churn and spot spikes that may signal product or billing issues.
4. **Payment failures over time** — A trend chart for `payment_failed`. Catching spikes early helps reduce involuntary churn.
5. **Project activity** — A trend chart for `project_created` and `project_deleted`. Understand how actively users are engaging with the core product.

You can build these insights and the dashboard at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
