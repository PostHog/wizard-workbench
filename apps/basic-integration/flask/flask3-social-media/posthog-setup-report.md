<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (Microblog) application. A `Posthog()` client instance is initialized in the application factory (`app/__init__.py`) before any blueprints are registered, using project token and host from environment variables. An `atexit` handler ensures all queued events are flushed when the application exits. Event capture uses the context manager API (`posthog_client.new_context()` with `identify_context()`) to link each server-side event to the correct user identity. Users are identified by their unique `username` at login, registration, and API user creation, with `email` and `username` set as person properties via `tag()`. The 500 error handler captures exceptions via `posthog_client.capture_exception()` for error tracking.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user completes the registration form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a valid password reset request is submitted | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user sets a new password via reset token | `app/auth/routes.py` |
| `post_created` | Fired when a user publishes a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message | `app/main/routes.py` |
| `posts_export_started` | Fired when a user triggers a background post export | `app/main/routes.py` |
| `post_translated` | Fired when a user requests a post translation | `app/main/routes.py` |
| `api_user_created` | Fired when a user is created via the REST API | `app/api/users.py` |
| `api_token_generated` | Fired when a user obtains an API authentication token | `app/api/tokens.py` |
| `api_token_revoked` | Fired when a user revokes their API token | `app/api/tokens.py` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Registration → Engagement funnel** — Funnel insight with steps: `user_registered` → `user_logged_in` → `post_created`. Shows how many new users go on to create content.
2. **Content creation over time** — Trends insight tracking `post_created` daily. Reveals content creation cadence and growth.
3. **Social engagement** — Trends insight with two series: `user_followed` and `user_unfollowed`. Highlights the health of the social graph.
4. **Messaging activity** — Trends insight tracking `message_sent` over time. Measures direct communication engagement.
5. **Active sessions** — Trends insight tracking `user_logged_in` over time. A proxy for daily/weekly active users.

Visit [your PostHog dashboard](/dashboard) to create these insights using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
