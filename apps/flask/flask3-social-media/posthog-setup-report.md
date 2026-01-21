# PostHog post-wizard report

The wizard has completed a deep integration of your Flask project with PostHog analytics. The following changes were made:

- **PostHog SDK installed**: Added `posthog` to `requirements.txt`
- **Environment configuration**: Created `.env` file with `POSTHOG_API_KEY` and `POSTHOG_HOST` variables
- **Application configuration**: Updated `config.py` with PostHog configuration settings
- **PostHog initialization**: Modified `app/__init__.py` to initialize PostHog globally in `create_app()`
- **Event tracking**: Added event capture calls throughout authentication, main routes, and API endpoints
- **User identification**: Implemented user identification using PostHog's context-based API
- **Error tracking**: Added exception capture to the 500 error handler

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User completed registration successfully | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in | `app/auth/routes.py` |
| `user_logged_out` | User logged out | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password | `app/auth/routes.py` |
| `post_created` | User created a new post | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `profile_updated` | User updated their profile | `app/main/routes.py` |
| `message_sent` | User sent a private message | `app/main/routes.py` |
| `search_performed` | User performed a search | `app/main/routes.py` |
| `posts_export_started` | User initiated post export | `app/main/routes.py` |
| `api_user_created` | User created via API | `app/api/users.py` |
| `api_token_generated` | API token generated for user | `app/api/tokens.py` |

## Next steps

### Create Your Dashboard

Visit your PostHog project to create a dashboard called "Analytics basics" with the following recommended insights:

1. **User Signup Funnel**: Track conversion from signup to first post creation
   - Events: `user_signed_up` -> `post_created`

2. **User Engagement Overview**: Track key user actions
   - Events: `user_logged_in`, `post_created`, `message_sent`, `user_followed`

3. **Social Activity Trends**: Monitor social interactions over time
   - Events: `user_followed`, `user_unfollowed`, `message_sent`

4. **Search Usage**: Understand how users discover content
   - Event: `search_performed` with `results_count` property

5. **User Retention**: Track login frequency and churn indicators
   - Events: `user_logged_in`, `user_logged_out`

### Environment Variables

Make sure your `.env` file contains:
```
POSTHOG_API_KEY=your_api_key_here
POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
