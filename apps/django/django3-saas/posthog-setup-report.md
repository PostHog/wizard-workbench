<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The `posthog` Python SDK has been installed and configured to initialize via Django's `AppConfig.ready()` pattern in `accounts/apps.py`. The `PosthogContextMiddleware` has been added to `config/settings.py` to automatically extract tracing headers and session context on every request. PostHog settings are read from environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`) which have been written to `.env`. Event tracking has been added to three app modules covering all key user lifecycle, billing, and product engagement moments — with user identification (`identify_context`) on every tracked action and exception capture (`capture_exception`) around Stripe billing error paths.

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully logs in | `accounts/views.py` |
| `user_logged_out` | Fired when a user logs out | `accounts/views.py` |
| `profile_updated` | Fired when a user updates their profile/settings | `accounts/views.py` |
| `subscription_started` | Fired when a user subscribes to a plan (Stripe checkout initiated or demo mode) | `billing/views.py` |
| `subscription_checkout_completed` | Fired when a Stripe checkout session completes successfully (server-side webhook) | `billing/views.py` |
| `subscription_plan_changed` | Fired when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their subscription | `billing/views.py` |
| `project_created` | Fired when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Fired when a user edits an existing project | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes a project | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/1295821)
- 🔻 **Signup → Checkout → Subscription Conversion Funnel**: [https://us.posthog.com/project/2/insights/Jd87MbjE](https://us.posthog.com/project/2/insights/Jd87MbjE)
- 📈 **New Sign Ups & Sign Ins (Daily)**: [https://us.posthog.com/project/2/insights/1i25ITSr](https://us.posthog.com/project/2/insights/1i25ITSr)
- 📉 **Churn Events: Account Deletions & Subscription Cancellations**: [https://us.posthog.com/project/2/insights/BamnfPgi](https://us.posthog.com/project/2/insights/BamnfPgi)
- 👥 **Team Growth: Invitations Sent (Weekly)**: [https://us.posthog.com/project/2/insights/Tw2tDfXk](https://us.posthog.com/project/2/insights/Tw2tDfXk)
- 💳 **Checkout Started (Weekly)**: [https://us.posthog.com/project/2/insights/IMrWThgg](https://us.posthog.com/project/2/insights/IMrWThgg)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
