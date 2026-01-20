# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Flask Microblog application. The integration includes comprehensive server-side event tracking for user authentication, social interactions, content creation, and API activity. PostHog has been initialized in the application factory with automatic exception capture via a global error handler.

## Summary of Changes

### Files Modified

| File | Changes |
|------|---------|
| `config.py` | Added PostHog configuration variables (API key, host, disabled flag) |
| `app/__init__.py` | Added PostHog initialization and global exception handler |
| `app/auth/routes.py` | Added authentication event tracking |
| `app/main/routes.py` | Added user engagement event tracking |
| `app/api/users.py` | Added API user creation event tracking |
| `app/api/tokens.py` | Added API token generation event tracking |
| `requirements.txt` | Added `posthog>=3.0.0` dependency |
| `.env` | Created with PostHog API key and host configuration |

### Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Fired when a new user successfully registers an account | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user creates a new post/microblog entry | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | Fired when a user updates their profile information | `app/main/routes.py` |
| `search_performed` | Fired when a user performs a search query | `app/main/routes.py` |
| `posts_exported` | Fired when a user initiates a post export task | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via API | `app/api/users.py` |
| `api_token_generated` | Fired when a user generates an API authentication token | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/2/dashboard/1094501) - Core analytics dashboard for tracking user engagement and authentication

### Insights
- [User Authentication Activity](https://us.posthog.com/project/2/insights/hnJjhUHO) - Tracks sign ups, logins, and logouts over time
- [User Engagement Activity](https://us.posthog.com/project/2/insights/YlC57M40) - Tracks posts created, follows, unfollows, and messages sent
- [Signup to First Post Funnel](https://us.posthog.com/project/2/insights/tTtwASHI) - Conversion funnel from user signup to creating their first post
- [Search & Profile Activity](https://us.posthog.com/project/2/insights/dh2Ypjtp) - Tracks search and profile-related activity
- [API Activity](https://us.posthog.com/project/2/insights/nYgcb5Mf) - Tracks API-related events: user creation and token generation

## Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

The following environment variables have been configured in `.env`:

```
POSTHOG_API_KEY=sTMFPsFhdP1Ssg
POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_DISABLED=False
```

To disable PostHog tracking (e.g., in development), set `POSTHOG_DISABLED=True`.
