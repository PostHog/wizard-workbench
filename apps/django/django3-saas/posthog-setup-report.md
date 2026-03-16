<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The PostHog Python SDK was installed, the `PosthogContextMiddleware` was added to the Django middleware stack to automatically extract session and user context from every request, and PostHog was initialized in the `AccountsConfig.ready()` method. Event tracking was added across three key areas: authentication flows (`accounts/views.py`), billing and subscription lifecycle (`billing/views.py`), and project management (`dashboard/views.py`).

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user saves profile/settings changes | `accounts/views.py` |
| `checkout_initiated` | Fired when a Stripe Checkout session is created | `billing/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan in demo mode | `billing/views.py` |
| `subscription_completed` | Fired when a Stripe `checkout.session.completed` webhook is received | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired when a Stripe payment failure webhook is received | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We've instrumented all the key conversion and churn events. You can now build insights and a dashboard in PostHog to keep an eye on user behavior:

- **[Create a new dashboard](https://us.posthog.com/project/2/dashboard/new)** named "Analytics basics"
- Suggested insights to add:
  - **Signup conversion funnel**: `user_registered` → `checkout_initiated` → `subscription_completed`
  - **Churn trend**: `subscription_canceled` over time
  - **Active users by plan**: unique users who fired `user_logged_in`, broken down by plan
  - **Payment failure rate**: `payment_failed` count vs `subscription_completed` count
  - **Project engagement**: `project_created` and `project_deleted` trends over time
- **[Browse all events](https://us.posthog.com/project/2/data-management/events)**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
