# PostHog post-wizard report

The wizard has completed a deep integration of your Django SaaS project with PostHog analytics. This integration adds comprehensive server-side event tracking for user authentication, subscription management, and project operations. The implementation follows PostHog's recommended patterns using the context API for proper user identification and event correlation.

## Configuration Summary

### Environment Variables
The following environment variables have been configured in `.env`:
- `POSTHOG_API_KEY` - Your PostHog project API key
- `POSTHOG_HOST` - PostHog API host (https://us.i.posthog.com)

### Django Settings
- Added PostHog configuration settings (`POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED`)
- Added `posthog.integrations.django.PosthogContextMiddleware` to MIDDLEWARE for automatic request context handling

### PostHog Initialization
- Created `accounts/apps.py` with `AccountsConfig` that initializes PostHog on Django startup
- Updated `INSTALLED_APPS` to use `accounts.apps.AccountsConfig`

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration and account creation | `accounts/views.py` |
| `user_logged_in` | User successfully logged into their account | `accounts/views.py` |
| `user_logged_out` | User logged out of their account | `accounts/views.py` |
| `profile_updated` | User updated their profile settings | `accounts/views.py` |
| `password_reset_requested` | User initiated a password reset request | `accounts/views.py` |
| `checkout_started` | User initiated checkout for a subscription plan | `billing/views.py` |
| `subscription_started` | User started a new subscription (checkout completed) | `billing/views.py` |
| `subscription_plan_changed` | User changed their subscription plan (upgrade or downgrade) | `billing/views.py` |
| `subscription_canceled` | User canceled their subscription | `billing/views.py` |
| `payment_failed` | Payment failed for a subscription (webhook event) | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User updated an existing project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |

## User Identification

Users are identified using their database ID as the `distinct_id`. The following person properties are set on signup and login:
- `email` - User's email address
- `username` - User's username
- `name` - User's full name (or username if not set)
- `company_name` - User's company name
- `date_joined` - Account creation timestamp

## Error Tracking

PostHog exception capture (`posthog.capture_exception()`) has been added to:
- Stripe checkout session creation errors
- Stripe subscription modification errors
- Stripe subscription cancellation errors
- Stripe billing portal errors
- Stripe webhook processing errors

## Next steps

We've instrumented your application with comprehensive event tracking. Here are recommended insights to create in your PostHog dashboard:

### Suggested Insights for "Analytics Basics" Dashboard

1. **Signup to Subscription Conversion Funnel**
   - Steps: `user_signed_up` -> `checkout_started` -> `subscription_started`
   - Track how many signups convert to paying customers

2. **User Retention: Active Users Over Time**
   - Track unique users triggering `user_logged_in` events
   - Compare daily, weekly, and monthly active users

3. **Subscription Churn Analysis**
   - Track `subscription_canceled` events over time
   - Include properties like `plan_name` and `subscription_duration_days`

4. **Plan Upgrade/Downgrade Trends**
   - Track `subscription_plan_changed` events
   - Break down by `change_type` (upgrade vs downgrade)

5. **Project Engagement**
   - Track `project_created` events over time
   - Correlation with subscription tier

### Create Dashboard Manually

To create the "Analytics Basics" dashboard in PostHog:

1. Go to your PostHog project at https://us.i.posthog.com
2. Navigate to Dashboards > New Dashboard
3. Name it "Analytics Basics"
4. Add insights using the events documented above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified

- `requirements.txt` - Added `posthog` dependency
- `config/settings.py` - Added PostHog configuration and middleware
- `accounts/apps.py` - Created with PostHog initialization
- `accounts/views.py` - Added authentication event tracking
- `billing/views.py` - Added subscription and payment event tracking
- `dashboard/views.py` - Added project CRUD event tracking
- `.env` - Added PostHog API key and host
