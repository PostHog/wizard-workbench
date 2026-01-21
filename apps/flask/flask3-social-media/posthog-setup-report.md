# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask microblog application. The integration includes user identification, event tracking for all major user actions, and error tracking for 500 errors. PostHog is initialized globally in the application factory (`create_app()`) and uses environment variables for configuration.

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully registered a new account | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in to their account | `app/auth/routes.py` |
| `user_logged_out` | User logged out of their account | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new post/microblog | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a private message to another user | `app/main/routes.py` |
| `profile_updated` | User updated their profile information | `app/main/routes.py` |
| `search_performed` | User performed a search query | `app/main/routes.py` |
| `posts_exported` | User initiated an export of their posts | `app/main/routes.py` |
| `api_user_created` | New user created via API | `app/api/users.py` |
| `api_token_generated` | API token generated for user | `app/api/tokens.py` |

## Configuration

PostHog configuration is set via environment variables in `.env`:

- `POSTHOG_API_KEY` - Your PostHog project API key
- `POSTHOG_HOST` - PostHog instance URL (defaults to `https://us.i.posthog.com`)
- `POSTHOG_DISABLED` - Set to `true` to disable PostHog (optional)

## Files Modified

1. **`requirements.txt`** - Added `posthog>=3.0.0` dependency
2. **`config.py`** - Added PostHog configuration settings
3. **`app/__init__.py`** - Initialized PostHog SDK in `create_app()`
4. **`app/auth/routes.py`** - Added auth events (signup, login, logout, password reset)
5. **`app/main/routes.py`** - Added engagement events (posts, follows, messages, search)
6. **`app/api/users.py`** - Added API user creation event
7. **`app/api/tokens.py`** - Added API token generation event
8. **`app/errors/handlers.py`** - Added error tracking with `capture_exception()`
9. **`.env`** - Created with PostHog configuration

## Next steps

We recommend creating the following insights and dashboards in your PostHog project:

### Suggested Insights

1. **User Signup Funnel** - Track conversion from `user_signed_up` to `user_logged_in` to `post_created`
2. **User Engagement** - Track `post_created`, `user_followed`, and `message_sent` events over time
3. **Retention Analysis** - Monitor returning users based on `user_logged_in` events
4. **Search Analytics** - Analyze `search_performed` events to understand user search behavior
5. **Error Monitoring** - Track 500 errors captured via `capture_exception()`

### Creating a Dashboard

1. Log in to [PostHog](https://us.i.posthog.com)
2. Navigate to Dashboards > New Dashboard
3. Name it "Analytics basics"
4. Add insights based on the events above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
