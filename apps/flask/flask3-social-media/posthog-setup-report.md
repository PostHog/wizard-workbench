<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application.

**Changes made:**

- **`requirements.txt`** — Added `posthog` dependency.
- **`config.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config values read from environment variables.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (gitignore coverage ensured).
- **`app/__init__.py`** — Initialized a `Posthog` instance globally in `create_app()` with `enable_exception_autocapture=True`. Registered `posthog_client.shutdown` with `atexit` to flush events on exit.
- **`app/auth/routes.py`** — Added user identification (`posthog_client.set`) and event capture for login, signup, logout, and password reset.
- **`app/main/routes.py`** — Added event capture for post creation, follow, unfollow, search, send message, and export posts.
- **`app/api/users.py`** — Added event capture for user creation via REST API.
- **`app/api/tokens.py`** — Added event capture for API token generation.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in to their account | `app/auth/routes.py` |
| `user_signed_up` | User successfully registered a new account via the web form | `app/auth/routes.py` |
| `user_logged_out` | User logged out of their account | `app/auth/routes.py` |
| `password_reset_requested` | User requested a password reset email | `app/auth/routes.py` |
| `post_created` | User submitted a new post on the feed | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a private message to another user | `app/main/routes.py` |
| `posts_exported` | User triggered an export of their posts | `app/main/routes.py` |
| `search_performed` | User performed a search query | `app/main/routes.py` |
| `api_user_created` | New user account created via the REST API | `app/api/users.py` |
| `api_token_created` | API authentication token generated for a user | `app/api/tokens.py` |

## Next steps

You can explore and build insights for these events in your PostHog project:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a Funnel: signup → first post](https://us.posthog.com/project/2/insights/new?insight=FUNNELS) — use `user_signed_up` → `post_created` to measure new user activation
- [Trend: Daily active users](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — trend on `user_logged_in` to track DAU
- [Trend: Content creation](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — trend on `post_created` to track content volume
- [Trend: Social engagement](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — trend on `user_followed` and `message_sent` to track engagement
- [Retention: User retention](https://us.posthog.com/project/2/insights/new?insight=RETENTION) — use `user_signed_up` as the cohort event and `user_logged_in` as the return event

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
