<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media app. The PostHog Python SDK (`posthog>=3.0`) was installed and initialized in the application factory. Event tracking was added across five files covering user authentication, social interactions, content creation, messaging, and API operations. User identification is performed at every tracked event using the user's database ID as the distinct ID, with person properties set via `tag()` at login and signup. The SDK is shut down gracefully via `atexit.register(posthog.shutdown)` to ensure all events are flushed on process exit.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully registered a new account | `app/auth/routes.py` |
| `user_logged_in` | User successfully logged in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User logged out of their session | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password using a token | `app/auth/routes.py` |
| `post_created` | User submitted a new post on the index/home feed | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a direct message to another user | `app/main/routes.py` |
| `posts_export_started` | User triggered an export of their posts as a background task | `app/main/routes.py` |
| `api_user_created` | New user created via the REST API | `app/api/users.py` |
| `api_token_issued` | API authentication token issued to a user | `app/api/tokens.py` |

## Files changed

- **`requirements.txt`** — Added `posthog` dependency
- **`config.py`** — Added `POSTHOG_KEY` and `POSTHOG_HOST` config entries reading from environment variables
- **`app/__init__.py`** — Initialized PostHog globally in `create_app()` using `posthog.api_key` and `posthog.host`; registered `posthog.shutdown` with `atexit`
- **`app/auth/routes.py`** — Added `user_signed_up`, `user_logged_in`, `user_logged_out`, `password_reset_requested`, `password_reset_completed` events with user identification
- **`app/main/routes.py`** — Added `post_created`, `user_followed`, `user_unfollowed`, `message_sent`, `posts_export_started` events
- **`app/api/users.py`** — Added `api_user_created` event
- **`app/api/tokens.py`** — Added `api_token_issued` event
- **`.env`** — Created with `POSTHOG_KEY` and `POSTHOG_HOST` values

## Next steps

To view your analytics, open PostHog and build insights using these events. Recommended insights to create:

1. **User acquisition funnel** — `user_signed_up` → `post_created` → `user_followed` (conversion from signup to engaged user)
2. **New signups over time** — Trend of `user_signed_up` to monitor growth
3. **Social engagement** — `user_followed` and `user_unfollowed` trends to monitor network growth vs churn
4. **Content activity** — `post_created` and `message_sent` counts to track active usage
5. **API adoption** — `api_user_created` and `api_token_issued` to monitor API integration growth

You can create a dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
