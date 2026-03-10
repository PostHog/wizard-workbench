<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The `posthog` Python SDK has been installed and configured to initialize globally in `create_app()`. Event tracking has been added to all critical user flows across authentication, content creation, social interactions, and the REST API.

## Changes made

### `config.py`
Added PostHog configuration values read from environment variables:
- `POSTHOG_API_KEY` (from `PH_PROJECT_API_KEY`)
- `POSTHOG_HOST`
- `POSTHOG_DISABLED`

### `app/__init__.py`
Added PostHog SDK initialization in `create_app()`, setting `posthog.api_key` and `posthog.host` from app config after all extensions are initialized and before blueprints are registered.

### `app/auth/routes.py`
Added event tracking and user identification to all auth endpoints using `new_context()` + `identify_context()` pattern.

### `app/main/routes.py`
Added event tracking to core social media actions including post creation, following/unfollowing users, editing profiles, sending messages, and exporting posts.

### `app/api/users.py`
Added event tracking for user creation through the REST API endpoint.

### `requirements.txt`
Added `posthog` package.

### `.env`
Added `PH_PROJECT_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user creates a new post; includes `language` and `body_length` properties | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user; includes `followed_username` | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user; includes `unfollowed_username` | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message; includes `message_length` | `app/main/routes.py` |
| `profile_updated` | Fired when a user updates their profile; includes `has_about_me` | `app/main/routes.py` |
| `posts_exported` | Fired when a user initiates post export | `app/main/routes.py` |
| `user_created_via_api` | Fired when a user is created through the REST API | `app/api/users.py` |

## Next steps

To build a dashboard for these events, head to your PostHog project and create a new dashboard named **"Analytics basics"** with these recommended insights:

1. **User acquisition funnel** — Funnel: `user_registered` → `post_created` → `user_followed` (measures how new users convert to engaged users)
2. **Daily active users** — Trend: unique users on `user_logged_in` per day
3. **Content creation rate** — Trend: `post_created` events over time, broken down by `language`
4. **Social engagement** — Trend: `user_followed` and `message_sent` events (measures community growth)
5. **Churn signal** — Trend: `user_logged_out` without returning `user_logged_in` within 7 days

Navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
