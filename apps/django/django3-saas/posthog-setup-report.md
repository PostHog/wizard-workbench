# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Django SaaS application. The integration includes:

- **PostHog SDK initialization** in `accounts/apps.py` using `AppConfig.ready()` for proper Django startup
- **Environment variables** configured for API key and host in `.env`
- **Middleware setup** using `PosthogContextMiddleware` for automatic request context tracking and exception capture
- **User identification** on login and signup with person properties (email, username, name, company)
- **Event tracking** for all critical business actions including authentication, subscriptions, and project management
- **Error tracking** using `capture_exception()` for payment errors and webhook failures

## Events implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | Track when a new user creates an account | `accounts/views.py` |
| `user_logged_in` | Track when a user logs in successfully | `accounts/views.py` |
| `user_logged_out` | Track when a user logs out | `accounts/views.py` |
| `profile_updated` | Track when a user updates their profile settings | `accounts/views.py` |
| `password_reset_requested` | Track when a user requests a password reset | `accounts/views.py` |
| `subscription_created` | Track when a user subscribes to a plan | `billing/views.py` |
| `subscription_plan_changed` | Track when a user changes their subscription plan | `billing/views.py` |
| `subscription_canceled` | Track when a user cancels their subscription | `billing/views.py` |
| `checkout_completed` | Track when a Stripe checkout session completes successfully | `billing/views.py` |
| `payment_failed` | Track when a payment fails | `billing/views.py` |
| `project_created` | Track when a user creates a new project | `dashboard/views.py` |
| `project_updated` | Track when a user updates a project | `dashboard/views.py` |
| `project_deleted` | Track when a user deletes a project | `dashboard/views.py` |

## Configuration files modified

| File | Changes |
|------|---------|
| `config/settings.py` | Added PostHog configuration (API key, host, disabled flag) and middleware |
| `accounts/apps.py` | Created AppConfig to initialize PostHog SDK on Django startup |
| `requirements.txt` | Added `posthog` dependency |
| `.env` | Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables |

## Next steps

### Create your analytics dashboard

Log into your PostHog project and create insights for these recommended analytics:

1. **User Signup Funnel**: Track `user_signed_up` -> `subscription_created` to measure conversion
2. **Subscription Revenue**: Track `subscription_created` and `subscription_plan_changed` with plan price properties
3. **Churn Analysis**: Monitor `subscription_canceled` events with plan and timing properties
4. **User Engagement**: Track `project_created`, `project_updated`, `project_deleted` for feature usage
5. **Payment Health**: Monitor `payment_failed` events to identify revenue at risk

### Recommended insights to create

1. **Signup to Subscription Conversion Funnel**
   - Steps: `user_signed_up` -> `subscription_created`
   - Breakdown by: plan_name

2. **Daily Active Users**
   - Events: `user_logged_in`
   - Unique users over time

3. **Subscription Churn Rate**
   - Events: `subscription_canceled`
   - Compare to `subscription_created`

4. **Project Activity**
   - Events: `project_created`, `project_updated`, `project_deleted`
   - Track feature engagement

5. **Payment Failure Rate**
   - Events: `payment_failed`
   - Alert on high failure rates

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment setup

Make sure your `.env` file contains:

```
POSTHOG_API_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
POSTHOG_HOST=https://us.i.posthog.com
```

To disable PostHog (e.g., for testing), add:

```
POSTHOG_DISABLED=true
```
