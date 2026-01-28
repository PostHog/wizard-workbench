# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask microblog application. The integration includes:

- **PostHog SDK initialization** in `app/__init__.py` using environment variables for configuration
- **User identification** on login and signup events with person properties (email, username)
- **Event tracking** for all key user actions including authentication, social interactions, and content creation
- **Error tracking** with automatic exception capture for 500 errors
- **Environment-based configuration** via `.env` file and Flask Config class

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration and created a new account | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in to their account | `app/auth/routes.py` |
| `user_logged_out` | User logged out of their account | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a direct message to another user | `app/main/routes.py` |
| `profile_updated` | User updated their profile information | `app/main/routes.py` |
| `posts_exported` | User initiated export of their posts | `app/main/routes.py` |
| `search_performed` | User performed a search | `app/main/routes.py` |
| `api_user_created` | New user created via API endpoint | `app/api/users.py` |
| `api_token_generated` | API authentication token was generated | `app/api/tokens.py` |

## Configuration Files Modified

- `config.py` - Added `POSTHOG_API_KEY` and `POSTHOG_HOST` configuration
- `.env` - Created with PostHog credentials
- `requirements.txt` - Added `posthog` package

## Next steps

We recommend creating the following insights and dashboards in PostHog to monitor user behavior:

### Suggested Dashboard: "Analytics basics"

Create these insights based on the events instrumented:

1. **User Signup Funnel** - Track conversion from signup to first post:
   - `user_signed_up` → `user_logged_in` → `post_created`

2. **User Engagement Trends** - Daily/weekly active users based on:
   - `post_created`, `user_followed`, `message_sent`

3. **Authentication Events** - Monitor login patterns:
   - `user_logged_in`, `user_logged_out` over time

4. **Social Graph Growth** - Track follow/unfollow activity:
   - `user_followed` vs `user_unfollowed` comparison

5. **Search Usage** - Monitor search feature adoption:
   - `search_performed` with query breakdown

### Creating Your Dashboard

1. Go to [PostHog Dashboards](https://us.i.posthog.com/dashboards)
2. Click "New dashboard" and name it "Analytics basics"
3. Add insights using the events listed above
4. Use funnels for conversion tracking and trends for activity monitoring

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure these environment variables are set in production:

```
POSTHOG_API_KEY=your_production_api_key
POSTHOG_HOST=https://us.i.posthog.com
```
