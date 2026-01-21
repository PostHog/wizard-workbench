# PostHog post-wizard report

The wizard has completed a deep integration of your Flask project with PostHog analytics. The integration includes event tracking, user identification, and error tracking across authentication, social features, and API endpoints.

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user signed up` | User completed registration | `app/auth/routes.py` |
| `user logged in` | User successfully logged in | `app/auth/routes.py` |
| `user logged out` | User logged out of their session | `app/auth/routes.py` |
| `password reset requested` | User requested a password reset email | `app/auth/routes.py` |
| `password reset completed` | User successfully reset their password | `app/auth/routes.py` |
| `post created` | User created a new post/tweet | `app/main/routes.py` |
| `user followed` | User followed another user | `app/main/routes.py` |
| `user unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `profile updated` | User updated their profile information | `app/main/routes.py` |
| `message sent` | User sent a private message | `app/main/routes.py` |
| `search performed` | User performed a search query | `app/main/routes.py` |
| `post export requested` | User requested to export their posts | `app/main/routes.py` |
| `api user created` | New user created via API | `app/api/users.py` |
| `api token generated` | API token generated for user | `app/api/tokens.py` |

## Error Tracking

Exception capture has been added to `app/errors/handlers.py` to track 500 errors in PostHog.

## User Identification

Users are identified using their email address on:
- Login (with `email` and `username` tags)
- Registration/Signup (with `email` and `username` tags)
- API user creation (with `email` and `username` tags)

## Configuration

Environment variables are set in `.env`:
- `POSTHOG_API_KEY` - Your PostHog project API key
- `POSTHOG_HOST` - PostHog host URL (https://us.i.posthog.com)

PostHog is initialized in `app/__init__.py` within the `create_app()` function.

## Next steps

### Create a Dashboard

Visit your PostHog project to create an "Analytics basics" dashboard with insights for:

1. **User Signup Funnel** - Track conversion from signup to first post
2. **User Engagement** - Track posts created, follows, and messages over time
3. **Retention Analysis** - Monitor login frequency and user activity
4. **Feature Usage** - Track search, export, and messaging features
5. **Error Rate** - Monitor 500 errors captured

### Recommended Insights

| Insight Type | Name | Events |
|--------------|------|--------|
| Funnel | Signup to First Post | `user signed up` -> `post created` |
| Funnel | Signup to First Follow | `user signed up` -> `user followed` |
| Trend | Daily Active Users | `user logged in` (unique users) |
| Trend | Content Creation | `post created`, `message sent` |
| Trend | Social Engagement | `user followed`, `user unfollowed` |

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
