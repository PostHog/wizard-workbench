<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The Python SDK is now installed and initialized via `accounts/apps.py` using Django's `AppConfig.ready()` hook, ensuring PostHog is configured once at startup. The `PosthogContextMiddleware` is registered after `AuthenticationMiddleware` in `config/settings.py`, so every request automatically carries session context, the authenticated user's distinct ID, current URL, request method, path, and IP address — with no per-view boilerplate needed for those fields.

Twelve events are captured across four views files, covering the full user lifecycle: registration and authentication, subscription conversion and churn, and core product usage (project management). User identity is established at login and signup using `identify_context()` with the Django user's primary key as the distinct ID, and person properties (username, staff status, join date) are set via `tag()`. Exception capture (`posthog.capture_exception()`) is added to Stripe-facing code paths in `billing/views.py`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in via the login form | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile settings | `accounts/views.py` |
| `pricing_viewed` | Fired when a user views the pricing page — top of subscription conversion funnel | `billing/views.py` |
| `subscription_started` | Fired when a user successfully starts a new subscription (demo mode or after Stripe checkout completes) | `billing/views.py` |
| `plan_changed` | Fired when a user changes their active subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `payment_failed` | Fired when a Stripe payment for a subscription fails via webhook | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user updates an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We've found an existing "Analytics basics" dashboard in your PostHog project that you can use to monitor user behavior:

- [Analytics basics dashboard](/dashboard/1296055)
  - [Sign-ups & Sign-ins (Daily)](/insights/eFh5TiwJ)
  - [Sign-up to Subscription Conversion Funnel](/insights/k7GA0RQW)
  - [Subscription Cancellations (Weekly)](/insights/tGqOWdE7)
  - [Account Deletions (Weekly)](/insights/ArSQQBSu)
  - [Team Collaboration Activity](/insights/bg7wPBOc)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
