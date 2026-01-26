# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask Microblog application. The integration includes:

- **Global PostHog initialization** in the Flask application factory (`app/__init__.py`)
- **User identification and tracking** on login, logout, and registration
- **Event tracking** for all key user actions including posts, follows, messages, searches, and exports
- **API event tracking** for user creation and token generation via the REST API
- **Error tracking** with exception capture in the 500 error handler
- **Environment-based configuration** using `POSTHOG_API_KEY` and `POSTHOG_HOST` variables

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully completed registration | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in | `app/auth/routes.py` |
| `user_logged_out` | User logged out of the application | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new blog post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a direct message to another user | `app/main/routes.py` |
| `profile_updated` | User updated their profile information | `app/main/routes.py` |
| `search_performed` | User performed a search query | `app/main/routes.py` |
| `posts_export_started` | User initiated a posts export task | `app/main/routes.py` |
| `api_user_created` | New user created via API | `app/api/users.py` |
| `api_token_generated` | API token generated for user authentication | `app/api/tokens.py` |

## Event Properties

Many events include useful properties for deeper analysis:

- `user_logged_in` / `user_signed_up`: `login_method`, `signup_method`
- `post_created`: `post_id`, `language`, `body_length`
- `user_followed` / `user_unfollowed`: `followed_user_id`, `followed_username` / `unfollowed_user_id`, `unfollowed_username`
- `message_sent`: `recipient_id`, `message_length`
- `search_performed`: `query`, `results_count`, `page`
- `api_user_created`: `signup_method`

## Person Properties

User identification includes the following person properties:

- `email`: User's email address
- `username`: User's username

## Configuration

PostHog is configured via environment variables in `.env`:

```
POSTHOG_API_KEY=sTMFPsFhdP1Ssg
POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

### Recommended Dashboard Insights

Create a dashboard in PostHog with these suggested insights based on the events instrumented:

1. **Signup to Login Conversion Funnel**
   - Events: `user_signed_up` -> `user_logged_in`
   - Type: Funnel
   - Purpose: Track user activation rate

2. **User Engagement Trend**
   - Events: `post_created`, `user_followed`, `message_sent`
   - Type: Trends (line chart)
   - Purpose: Monitor daily/weekly engagement

3. **Feature Usage Breakdown**
   - Events: `post_created`, `search_performed`, `message_sent`, `posts_export_started`
   - Type: Trends (bar chart)
   - Purpose: Understand which features users engage with most

4. **User Retention (Login Frequency)**
   - Event: `user_logged_in`
   - Type: Retention
   - Purpose: Track how often users return to the app

5. **Social Graph Growth**
   - Events: `user_followed` vs `user_unfollowed`
   - Type: Trends (stacked area)
   - Purpose: Monitor net follower growth and churn

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files Modified

- `app/__init__.py` - Added PostHog initialization
- `app/auth/routes.py` - Added authentication event tracking
- `app/main/routes.py` - Added main feature event tracking
- `app/api/users.py` - Added API user creation event tracking
- `app/api/tokens.py` - Added API token generation event tracking
- `app/errors/handlers.py` - Added error exception capture
- `config.py` - Added PostHog configuration variables
- `requirements.txt` - Added posthog package
- `.env` - Created with PostHog API key and host
