<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Django SaaS project. The Python SDK (`posthog`) has been added as a dependency and initialized in `accounts/apps.py` via Django's `AppConfig.ready()` hook. The `PosthogContextMiddleware` has been added to automatically extract tracing headers on every request. Eleven events covering the full user and billing lifecycle have been instrumented across three view files, with user identification (`identify_context`) on every event to correlate server-side behavior back to individual users.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile settings | `accounts/views.py` |
| `subscription_started` | Fired when a user starts a new subscription (demo or Stripe redirect) | `billing/views.py` |
| `checkout_completed` | Fired via Stripe webhook when checkout session completes | `billing/views.py` |
| `plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired via Stripe webhook when a payment fails | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

Create an "Analytics basics" dashboard in PostHog and add the following insights to monitor user behavior:

1. **Signup-to-subscription conversion funnel** — Track `user_signed_up` → `subscription_started` to measure activation rate
   https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","order":0},{"id":"subscription_started","name":"subscription_started","type":"events","order":1}]}

2. **New signups over time** — `user_signed_up` trend to track user acquisition
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","order":0}]}

3. **Subscription cancellations** — `subscription_canceled` trend to monitor churn
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_canceled","name":"subscription_canceled","type":"events","order":0}]}

4. **Payment failures** — `payment_failed` trend to catch billing problems early
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"payment_failed","name":"payment_failed","type":"events","order":0}]}

5. **Project creation activity** — `project_created` trend as a product engagement signal
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"project_created","name":"project_created","type":"events","order":0}]}

Create a new dashboard here and add each insight to it:
https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
