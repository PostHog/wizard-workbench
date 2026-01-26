# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Django SaaS project. The integration includes:

- **PostHog SDK initialization** in `config/apps.py` using the AppConfig pattern
- **Context middleware** for automatic request context and exception capture
- **User identification** on login and signup with person properties
- **Event tracking** for key business actions across authentication, billing, and dashboard flows
- **Exception capture** for error tracking on critical operations
- **Environment variables** configuration via `.env` file

## Events implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration and was logged in | `accounts/views.py` |
| `user_logged_in` | User successfully authenticated via login form | `accounts/views.py` |
| `user_logged_out` | User logged out of the application | `accounts/views.py` |
| `profile_updated` | User updated their profile settings | `accounts/views.py` |
| `subscription_started` | User subscribed to a plan (demo or Stripe) | `billing/views.py` |
| `subscription_plan_changed` | User changed their subscription plan | `billing/views.py` |
| `subscription_canceled` | User canceled their subscription | `billing/views.py` |
| `checkout_completed` | Stripe checkout was successfully completed (webhook) | `billing/views.py` |
| `payment_failed` | A subscription payment failed (webhook) | `billing/views.py` |
| `project_created` | User created a new project | `dashboard/views.py` |
| `project_updated` | User updated an existing project | `dashboard/views.py` |
| `project_deleted` | User deleted a project | `dashboard/views.py` |

## Configuration files modified

- `config/settings.py` - Added PostHog settings and middleware
- `config/apps.py` - Created AppConfig with PostHog initialization
- `requirements.txt` - Added posthog dependency
- `.env` - Created with PostHog API key and host
- `.env.example` - Updated with PostHog configuration template

## Next steps

### Create your analytics dashboard

Create an "Analytics basics" dashboard in PostHog with the following recommended insights:

1. **Signup to Subscription Funnel** - Track conversion from `user_signed_up` → `subscription_started`
2. **User Activity Over Time** - Trend of `user_logged_in` events
3. **Subscription Churn** - Count of `subscription_canceled` events over time
4. **Project Engagement** - Events `project_created`, `project_updated`, `project_deleted`
5. **Payment Health** - Monitor `payment_failed` vs `checkout_completed`

Create your dashboard at: https://us.i.posthog.com/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/django/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Running the application

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Ensure your `.env` file has the PostHog credentials:
   ```
   POSTHOG_API_KEY=sTMFPsFhdP1Ssg
   POSTHOG_HOST=https://us.i.posthog.com
   ```

3. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

Events will be sent to PostHog automatically as users interact with the application.
