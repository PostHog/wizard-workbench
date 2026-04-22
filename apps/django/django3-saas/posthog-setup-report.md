<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Django SaaS application. The Python SDK is initialized in `accounts/apps.py` via `AppConfig.ready()`, configured with credentials from environment variables. The `PosthogContextMiddleware` is added to the Django middleware stack to automatically tag all requests with session/user context and capture exceptions. Twelve key business events are now tracked across the accounts, billing, and dashboard apps — covering the full user lifecycle from signup through subscription management and feature usage.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration. Top of the conversion funnel. | `accounts/views.py` |
| `user_logged_in` | Fired when an existing user successfully logs in. | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out of the application. | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their account profile settings. | `accounts/views.py` |
| `subscription_started` | Fired when a user initiates a subscription (before payment). Tracks plan selection intent. | `billing/views.py` |
| `subscription_completed` | Fired after a successful Stripe checkout or demo subscription creation. | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription. Critical churn event. | `billing/views.py` |
| `plan_changed` | Fired when a user upgrades or downgrades their subscription plan. | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when a subscription payment fails. Revenue risk signal. | `billing/views.py` |
| `project_created` | Fired when a user creates a new project. Key activation metric. | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project. Potential churn indicator. | `dashboard/views.py` |
| `project_updated` | Fired when a user edits an existing project. Engagement metric. | `dashboard/views.py` |

## Next steps

We've configured PostHog to track your core business metrics. You can build insights and a dashboard in your PostHog project to monitor these events:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard) — Create an "Analytics basics" dashboard here
- **Suggested Insight 1 — Signup-to-subscription funnel**: `user_signed_up` → `subscription_started` → `subscription_completed`
- **Suggested Insight 2 — Daily new signups**: Trend of `user_signed_up` over time
- **Suggested Insight 3 — Churn events**: Trend of `subscription_canceled` over time
- **Suggested Insight 4 — Activation rate**: Trend of `project_created` relative to `user_signed_up`
- **Suggested Insight 5 — Payment failures**: Trend of `payment_failed` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
