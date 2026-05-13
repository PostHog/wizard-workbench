<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog application. PostHog is initialized using the `Posthog()` instance-based client in `create_app()` and stored on the Flask app object for access throughout the application. Event tracking was added across authentication, social features, messaging, and the REST API, with manual exception capture wired into the 500 error handler.

## Changes summary

- **`config.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config entries read from environment variables
- **`requirements.txt`** — Added `posthog` dependency
- **`.env`** — Populated `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values
- **`app/__init__.py`** — Initialized `Posthog()` client in `create_app()`, stored as `app.posthog_client`, registered `shutdown` with `atexit`
- **`app/auth/routes.py`** — Added tracking for login, logout, registration, and password reset flows
- **`app/main/routes.py`** — Added tracking for post creation, follow/unfollow, messaging, profile edits, and post exports
- **`app/api/users.py`** — Added tracking for API-based user creation
- **`app/api/tokens.py`** — Added tracking for API token generation
- **`app/errors/handlers.py`** — Added manual `capture_exception()` in the 500 error handler

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user successfully completes registration | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user creates a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message | `app/main/routes.py` |
| `profile_updated` | Fired when a user updates their profile information | `app/main/routes.py` |
| `posts_exported` | Fired when a user initiates a post export task | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the API | `app/api/users.py` |
| `api_token_generated` | Fired when an API token is generated for a user | `app/api/tokens.py` |

## Next steps

We've set up tracking for the key user actions across this app. Here are some recommended insights to build in PostHog for monitoring user behavior:

- **Registration-to-login funnel** — Track conversion from `user_registered` → `user_logged_in` to measure new user activation: [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
- **Daily active users** — Trend of unique users firing `user_logged_in` over time: [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Post creation volume** — Trend of `post_created` events showing content publishing activity: [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Social engagement** — Compare `user_followed` vs `user_unfollowed` trends to track follower growth health: [Create trends insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Error rate** — Track 500 errors captured via `$exception` to monitor app stability: [View error tracking](https://us.posthog.com/project/2/error_tracking)

You can also build a dashboard combining these insights at: [Create dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
