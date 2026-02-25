<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Flask microblog (Microblog) application. The following changes were made:

- **`app/__init__.py`** — PostHog is initialized globally in `create_app()` using `posthog.api_key` and `posthog.host` from the app config. `posthog.shutdown` is registered with `atexit` to ensure all events are flushed on process exit.
- **`config.py`** — Added `POSTHOG_API_KEY` and `POSTHOG_HOST` config values, loaded from environment variables.
- **`requirements.txt`** — Added `posthog` dependency.
- **`.env`** — Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` values. The file is covered by `.gitignore`.
- **`app/auth/routes.py`** — User identity is set and events are captured on login, registration, logout, password reset request, and password reset completion.
- **`app/main/routes.py`** — Events captured for post creation, profile updates, follow/unfollow actions, private messages, and post exports.
- **`app/api/users.py`** — Event captured when a user is created via the REST API.
- **`app/api/tokens.py`** — Events captured when API tokens are obtained and revoked.
- **`app/errors/handlers.py`** — Exceptions are automatically captured in PostHog on 500 errors using `posthog.capture_exception()`.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers an account | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user publishes a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `posts_exported` | Fired when a user triggers a post export task | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `api_user_created` | Fired when a user is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | Fired when a user obtains an API auth token | `app/api/tokens.py` |
| `api_token_revoked` | Fired when a user revokes their API auth token | `app/api/tokens.py` |

## Next steps

Dashboard creation requires `dashboard:write` API key scope which is not available in the current environment. To create your analytics dashboard manually in PostHog, navigate to your project and add insights for:

1. **User Signup Funnel** — Funnel: `user_signed_up` → `user_logged_in` → `post_created` (tracks new user activation)
2. **Daily Active Users** — Trend: unique users performing `user_logged_in`
3. **Content Creation Rate** — Trend: `post_created` event count over time
4. **Social Engagement** — Trend: `user_followed` + `message_sent` events
5. **Churn Signal** — Trend: `user_logged_out` where users haven't triggered `post_created` in 7 days

You can create the dashboard at: https://us.i.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
