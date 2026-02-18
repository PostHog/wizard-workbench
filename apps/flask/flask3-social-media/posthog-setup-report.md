# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask application. The integration includes server-side event tracking for all major user actions, user identification for authenticated sessions, and error tracking for 500 errors.

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully completed registration | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in | `app/auth/routes.py` |
| `user_logged_out` | User logged out | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a direct message to another user | `app/main/routes.py` |
| `profile_updated` | User updated their profile information | `app/main/routes.py` |
| `search_performed` | User performed a search query | `app/main/routes.py` |
| `posts_export_started` | User initiated an export of their posts | `app/main/routes.py` |
| `api_user_created` | New user created via API | `app/api/users.py` |
| `api_token_generated` | API token generated for user | `app/api/tokens.py` |

## Configuration Files Modified

- `config.py` - Added `POSTHOG_API_KEY` and `POSTHOG_HOST` configuration
- `app/__init__.py` - Initialized PostHog globally in `create_app()`
- `.env` - Added PostHog environment variables

## Error Tracking

Error tracking with `posthog.capture_exception()` has been added to the 500 error handler in `app/errors/handlers.py`. This will automatically capture and report server errors to PostHog with user context when available.

## User Identification

Users are identified in PostHog upon:
- Registration (with email and username properties)
- Login (with email and username properties)
- API user creation (with email and username properties)

The `distinct_id` is set to the user's database ID for consistent tracking across sessions.

## Next steps

### Create a Dashboard in PostHog

To create an "Analytics basics" dashboard with insights based on these events:

1. Go to your PostHog project at https://us.i.posthog.com
2. Navigate to Dashboards > New Dashboard
3. Create insights such as:
   - **User Signups Over Time**: Trend of `user_signed_up` events
   - **Login to Post Funnel**: Funnel from `user_logged_in` -> `post_created`
   - **User Engagement**: Count of `post_created`, `message_sent`, `user_followed` events
   - **Search Usage**: Trend of `search_performed` events with query breakdown
   - **Churn Indicator**: Users who logged in but didn't create posts

### Recommended Insights

| Insight Type | Events | Description |
|--------------|--------|-------------|
| Trend | `user_signed_up` | Daily/weekly signups |
| Funnel | `user_signed_up` -> `post_created` | Conversion from signup to first post |
| Funnel | `user_logged_in` -> `user_followed` | Conversion from login to follow action |
| Trend | `user_unfollowed` | Churn indicator - unfollows over time |
| Table | `search_performed` by query | Most popular search terms |

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables are configured in `.env`:

```
POSTHOG_API_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
POSTHOG_HOST=https://us.i.posthog.com
```

Make sure these are set in your production environment as well.
