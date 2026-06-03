<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Flask social media application (Microblog). The `posthog` Python SDK was installed and configured, PostHog is initialized in `create_app()` using environment variables, and 13 business-critical events are now captured across authentication, content creation, social interactions, messaging, and the REST API.

## Changes made

- **`requirements.txt`** — Added `posthog` dependency
- **`config.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config keys read from environment variables
- **`app/__init__.py`** — Initialized PostHog (`posthog.api_key`, `posthog.host`) inside `create_app()` before blueprint registration
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (gitignore-covered)
- **`app/auth/routes.py`** — Added 5 auth events
- **`app/main/routes.py`** — Added 7 social/content events
- **`app/api/users.py`** — Added 1 API event

## Tracked events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates with username and password | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request (for a found account) | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via a valid token | `app/auth/routes.py` |
| `post_created` | Fired when a user publishes a new post from the home feed | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a direct message to another user | `app/main/routes.py` |
| `search_performed` | Fired when a user submits a search query | `app/main/routes.py` |
| `posts_export_started` | Fired when a user triggers a background export of their posts | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Signup → Login funnel** — Funnel from `user_signed_up` → `user_logged_in` to measure new-user activation
- **Content creation trend** — Trends chart of `post_created` over time to track posting activity
- **Social engagement** — Trends chart of `user_followed` and `user_unfollowed` to track relationship growth/churn
- **Messaging activity** — Trends chart of `message_sent` with `message_length` as a numeric aggregate
- **Search usage** — Trends chart of `search_performed` with `result_count` to track search satisfaction

You can build these at [/insights](/insights) and organize them in a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
