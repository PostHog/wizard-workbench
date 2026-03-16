<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Flask social media (Microblog) application. The `posthog` Python SDK has been added as a dependency, initialized with the instance-based `Posthog()` constructor in `create_app()`, and event capture calls have been added across all major user-facing routes. User identification (via `posthog_client.set()`) is performed on login and registration so that server-side events are tied to a known person profile. Exceptions in the 500 error handler are automatically forwarded to PostHog via `capture_exception()`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes web registration | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user publishes a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves profile changes | `app/main/routes.py` |
| `search_performed` | Fired when a user submits a search | `app/main/routes.py` |
| `posts_export_started` | Fired when a user initiates a post export | `app/main/routes.py` |
| `api_user_created` | Fired when a user is created via the REST API | `app/api/users.py` |
| `api_token_created` | Fired when an API auth token is issued | `app/api/tokens.py` |

## Next steps

Create a dashboard called **"Analytics basics"** in PostHog at https://us.posthog.com/project/2/dashboard and add these five insights:

1. **Registration funnel** — Funnel from `user_registered` → `user_logged_in` → `post_created`. Measures how many new users complete their first post after signing up.

2. **Daily active users (posts)** — Trend of unique users who fire `post_created` per day. Core engagement metric.

3. **Social engagement** — Trend of `user_followed` and `message_sent` side by side. Shows relationship-building activity over time.

4. **Churn signal** — Trend of `user_logged_out` without a subsequent `user_logged_in` within 7 days (or simply the raw `user_logged_out` trend as a proxy for session endings).

5. **Password reset funnel** — Funnel from `password_reset_requested` → `password_reset_completed`. A high drop-off here signals friction in the reset flow.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
