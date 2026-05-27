# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Flask Microblog social media application. The `posthog` Python SDK has been installed and a `Posthog` client instance is initialized in the application factory (`app/__init__.py`) using environment variables. User identification is applied on login and signup using `identify_context()` with the user's database ID as the distinct ID. Exception autocapture is enabled, and a manual `capture_exception()` call has been added to the 500 error handler. All events follow the same naming convention using `snake_case`.

## Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a direct message | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `post_search_performed` | Fired when a user performs a search | `app/main/routes.py` |
| `post_translated` | Fired when a user translates a post | `app/main/routes.py` |
| `posts_export_started` | Fired when a user initiates a posts export | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | Fired when a user obtains an API authentication token | `app/api/tokens.py` |

## Next steps

We've instrumented your app with 15 events across all key user flows. To explore your data in PostHog, visit:

- [All events — Activity](https://app.posthog.com/events)
- [Create an "Analytics basics" dashboard](https://app.posthog.com/dashboard) — recommended insights to add:
  - **User signups over time** — Trends on `user_signed_up`
  - **Post engagement** — Trends on `post_created`, `message_sent`, `user_followed`
  - **Signup → First post funnel** — Funnel: `user_signed_up` → `post_created`
  - **Password reset funnel** — Funnel: `password_reset_requested` → `password_reset_completed`
  - **Social graph growth** — Trends on `user_followed` vs `user_unfollowed`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
