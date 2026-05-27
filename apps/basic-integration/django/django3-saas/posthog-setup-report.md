# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Django SaaS application. The integration includes the Python SDK configured via `AppConfig.ready()`, the `PosthogContextMiddleware` for automatic request tagging, and 10 key business events instrumented across authentication, billing, and the project dashboard. Users are identified at login and registration using `identify_context()`, linking backend events to any frontend sessions.

**Files created or modified:**

| File | Change |
|---|---|
| `accounts/apps.py` | Created — initializes `posthog.api_key` and `posthog.host` from settings in `AppConfig.ready()` |
| `config/settings.py` | Added `POSTHOG_PROJECT_TOKEN`/`POSTHOG_HOST` settings; updated `INSTALLED_APPS` to use `AccountsConfig`; added `PosthogContextMiddleware` to `MIDDLEWARE` |
| `accounts/views.py` | Added PostHog imports; `user_registered` on signup; `user_logged_in` on login (via `form_valid` override); `profile_updated` on profile save |
| `billing/views.py` | Added PostHog imports; `pricing_viewed` on pricing page; `subscription_started` on demo subscribe and Stripe webhook checkout completion; `subscription_canceled` on cancellation; `plan_changed` on plan switch; `payment_failed` on failed invoice webhook |
| `dashboard/views.py` | Added PostHog imports; `project_created` on project creation; `project_deleted` on project deletion |
| `requirements.txt` | Added `posthog` dependency |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

**Events instrumented:**

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user successfully completes registration | `accounts/views.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `accounts/views.py` |
| `profile_updated` | Fired when an authenticated user saves changes to their profile settings | `accounts/views.py` |
| `pricing_viewed` | Fired when any visitor views the pricing page — top of the subscription conversion funnel | `billing/views.py` |
| `subscription_started` | Fired when a user starts a new subscription (demo mode and Stripe checkout webhook) | `billing/views.py` |
| `subscription_canceled` | Fired when a user cancels their active subscription | `billing/views.py` |
| `plan_changed` | Fired when a user switches from one subscription plan to another | `billing/views.py` |
| `payment_failed` | Fired from the Stripe webhook handler when an invoice payment fails | `billing/views.py` |
| `project_created` | Fired when a user creates a new project in the dashboard | `dashboard/views.py` |
| `project_deleted` | Fired when a user deletes an existing project from the dashboard | `dashboard/views.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1628581)

To get the most out of these events, consider adding these insights to your dashboard:

- **Subscription conversion funnel**: `pricing_viewed` → `subscription_started` — shows how many visitors who view pricing ultimately subscribe
- **New registrations over time**: trend on `user_registered` — tracks daily sign-up growth
- **Subscription health**: `subscription_started` vs `subscription_canceled` trends — monitors churn signals
- **Payment failures**: trend on `payment_failed` — alerts to revenue-at-risk
- **Project engagement**: trend on `project_created` — measures product adoption depth

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
