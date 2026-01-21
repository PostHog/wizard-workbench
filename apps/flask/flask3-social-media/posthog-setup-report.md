# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask microblog application. The integration includes:

- **PostHog SDK initialization** in the Flask application factory (`app/__init__.py`)
- **User identification** on login and signup events with person properties (email, username)
- **Event tracking** for all key user actions including authentication, social interactions, content creation, and API usage
- **Error tracking** in error handlers and background tasks using `posthog.capture_exception()`
- **Environment variables** configured for secure API key management

## Events Integrated

| Event Name | Description | File |
|------------|-------------|------|
| `user_logged_in` | User successfully logged in via the web form | `app/auth/routes.py` |
| `user_logged_out` | User logged out of their account | `app/auth/routes.py` |
| `user_signed_up` | New user registered an account | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new post/microblog | `app/main/routes.py` |
| `profile_updated` | User updated their profile information | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `search_performed` | User performed a search query | `app/main/routes.py` |
| `message_sent` | User sent a private message to another user | `app/main/routes.py` |
| `posts_export_requested` | User requested to export their posts | `app/main/routes.py` |
| `api_user_created` | New user created via API endpoint | `app/api/users.py` |
| `api_user_updated` | User updated via API endpoint | `app/api/users.py` |
| `api_token_generated` | User generated an API authentication token | `app/api/tokens.py` |

## Error Tracking

Exception capture has been added to:
- `app/errors/handlers.py` - 500 internal server errors
- `app/tasks.py` - Background task failures

## Configuration

Environment variables (stored in `.env`):
- `POSTHOG_API_KEY` - Your PostHog project API key
- `POSTHOG_HOST` - PostHog instance URL (defaults to `https://us.i.posthog.com`)
- `POSTHOG_DISABLED` - Set to `true` to disable PostHog (optional)

## Next steps

We recommend creating the following insights and dashboards in PostHog to monitor user behavior:

1. **User Signup Funnel** - Track conversion from registration to first post
   - Events: `user_signed_up` → `user_logged_in` → `post_created`

2. **Engagement Dashboard** - Monitor daily active users and engagement
   - Events: `user_logged_in`, `post_created`, `message_sent`

3. **Social Graph Growth** - Track follower/following activity
   - Events: `user_followed`, `user_unfollowed`

4. **Search Usage** - Monitor search behavior
   - Event: `search_performed` with `query_length` and `results_count` properties

5. **Error Tracking** - Monitor application errors
   - Use PostHog's Error Tracking feature

Visit your PostHog dashboard at: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
