# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Django SaaS application. The integration includes:

- **PostHog Python SDK** added to requirements.txt
- **Environment configuration** for API key and host in `.env`
- **Django middleware** (`PosthogContextMiddleware`) for automatic request context
- **AppConfig initialization** in `accounts/apps.py` to configure PostHog on startup
- **User identification** on login and signup with person properties (email, username, company_name)
- **Event tracking** across authentication, project management, and billing flows
- **Error tracking** with `capture_exception()` for payment and billing errors

## Events Added

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed registration and was logged in | `accounts/views.py` |
| `user_logged_in` | User successfully logged in to their account | `accounts/views.py` |
| `user_logged_out` | User logged out of their account | `accounts/views.py` |
| `profile_updated` | User updated their profile settings | `accounts/views.py` |
| `password_reset_requested` | User requested a password reset email | `accounts/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User updated an existing project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |
| `checkout_initiated` | User started the checkout process for a subscription | `billing/views.py` |
| `subscription_started` | User subscribed to a plan (checkout completed) | `billing/views.py` |
| `subscription_plan_changed` | User changed their subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their subscription | `billing/views.py` |
| `payment_failed` | A subscription payment failed (webhook event) | `billing/views.py` |

## Configuration Files Modified

| File | Changes |
|------|---------|
| `config/settings.py` | Added PostHog settings (`POSTHOG_API_KEY`, `POSTHOG_HOST`, `POSTHOG_DISABLED`) and middleware |
| `accounts/apps.py` | Created AppConfig to initialize PostHog SDK on Django startup |
| `requirements.txt` | Added `posthog` dependency |
| `.env` | Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables |

## Next steps

### Recommended Dashboard Insights

Create a dashboard named "Analytics basics" in your PostHog project with the following insights:

1. **Signup to Subscription Funnel**
   - Events: `user_signed_up` → `checkout_initiated` → `subscription_started`
   - Track conversion from signup through paid subscription

2. **User Activity Trend**
   - Events: `user_logged_in`, `project_created`, `project_updated`
   - Monitor daily/weekly active users and engagement

3. **Subscription Churn Analysis**
   - Events: `subscription_canceled`
   - Track cancellation rate over time with breakdown by plan

4. **Payment Health**
   - Events: `payment_failed`, `subscription_started`
   - Monitor payment success rate and failed payment trends

5. **Project Engagement**
   - Events: `project_created`, `project_updated`, `project_deleted`
   - Track how users interact with projects over time

### Creating the Dashboard

Visit your PostHog project and create these insights:
- PostHog Dashboard: https://us.posthog.com/project/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure your `.env` file contains:

```
POSTHOG_API_KEY=sTMFPsFhdP1Ssg
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_DISABLED=False
```

## Testing the Integration

1. Start your Django development server: `python manage.py runserver`
2. Register a new user and verify `user_signed_up` event appears in PostHog
3. Log in/out and verify authentication events
4. Create/edit/delete projects to test project events
5. Subscribe to a plan to test billing events
