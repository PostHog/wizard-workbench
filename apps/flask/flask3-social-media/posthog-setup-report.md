# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask microblog application. The integration adds comprehensive event tracking for user authentication, content creation, social interactions, and API usage. PostHog has been initialized globally in the application factory (`create_app()`) and event capture uses the context-based API pattern with proper user identification.

## Events integrated

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in | `app/auth/routes.py` |
| `user_logged_out` | User logged out | `app/auth/routes.py` |
| `password_reset_requested` | User requested password reset | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `profile_updated` | User updated their profile | `app/main/routes.py` |
| `message_sent` | User sent a direct message | `app/main/routes.py` |
| `search_performed` | User performed a search | `app/main/routes.py` |
| `posts_exported` | User initiated post export | `app/main/routes.py` |
| `api_user_created` | New user created via API | `app/api/users.py` |
| `api_token_generated` | API token generated for user | `app/api/tokens.py` |
| `api_token_revoked` | API token revoked | `app/api/tokens.py` |

## Configuration

PostHog is configured via environment variables in `.env`:

- `POSTHOG_API_KEY` - Your PostHog project API key
- `POSTHOG_HOST` - PostHog instance URL (defaults to `https://us.i.posthog.com`)

The configuration is loaded in `config.py` and PostHog is initialized in `app/__init__.py`.

## Error tracking

Exception capture has been added to the 500 error handler in `app/errors/handlers.py` using `posthog.capture_exception()` to track server errors with user context when available.

## Next steps

### Create a dashboard in PostHog

1. Log in to your PostHog instance at https://us.i.posthog.com
2. Create a new dashboard named "Analytics basics"
3. Add the following insights:

**Recommended insights:**

1. **User Signups Over Time** - Trend chart tracking `user_signed_up` events
2. **Signup to First Post Funnel** - Funnel from `user_signed_up` → `post_created`
3. **Daily Active Users** - Unique users performing any event
4. **User Engagement Mix** - Breakdown of events by type (`post_created`, `user_followed`, `message_sent`)
5. **Authentication Events** - Track login/logout/password reset trends

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Files modified

- `app/__init__.py` - Added PostHog initialization
- `app/auth/routes.py` - Added authentication events with user identification
- `app/main/routes.py` - Added content and social interaction events
- `app/api/users.py` - Added API user creation event
- `app/api/tokens.py` - Added API token events
- `app/errors/handlers.py` - Added exception capture
- `config.py` - Added PostHog configuration variables
- `requirements.txt` - Added posthog dependency
- `.env` - Created with PostHog credentials
