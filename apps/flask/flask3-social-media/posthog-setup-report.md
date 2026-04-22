# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask 3 social media application (Microblog). The `posthog` Python SDK was added as a dependency and a `Posthog` client instance is initialized globally in `create_app()` using environment variables. An `atexit` shutdown handler is registered to ensure all events are flushed before the process exits.

Fourteen events are now captured across five files covering the full user lifecycle — registration, authentication, social interactions, content creation, messaging, search, and API access. User identity is set on signup and login using `posthog_client.set()` to record person properties.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completed registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | User successfully authenticated via the login form | `app/auth/routes.py` |
| `user_logged_out` | User explicitly logged out of their session | `app/auth/routes.py` |
| `password_reset_requested` | User submitted the password reset request form | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password using the token | `app/auth/routes.py` |
| `post_created` | User submitted a new post on the index/home feed | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `profile_updated` | User saved changes to their profile (username or about_me) | `app/main/routes.py` |
| `message_sent` | User sent a private message to another user | `app/main/routes.py` |
| `posts_export_started` | User initiated a background task to export their posts | `app/main/routes.py` |
| `search_performed` | User performed a search query | `app/main/routes.py` |
| `api_user_created` | A new user account was created via the REST API | `app/api/users.py` |
| `api_token_generated` | User obtained an API token via HTTP Basic Auth | `app/api/tokens.py` |

## Files modified

- `requirements.txt` — added `posthog` dependency
- `config.py` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config values
- `app/__init__.py` — initialized `Posthog` client in `create_app()`, registered `atexit` shutdown
- `app/auth/routes.py` — login, logout, register, password reset events + user identification
- `app/main/routes.py` — post, follow, unfollow, profile, message, search, export events
- `app/api/users.py` — API user creation event + user identification
- `app/api/tokens.py` — API token generation event

## Next steps

To explore user behavior in PostHog, visit your project and create the following insights manually:

- **Signup funnel** — `user_signed_up` → `post_created` → `user_followed`: measures how many new users go on to create content and build a social graph.
- **Engagement trend** — trend of `post_created` and `message_sent` over time: tracks daily/weekly content activity.
- **Authentication events** — breakdown of `user_logged_in` by `login_method` property.
- **Password reset funnel** — `password_reset_requested` → `password_reset_completed`: identifies drop-off in the reset flow.
- **API adoption** — trend of `api_user_created` and `api_token_generated`: shows growth in API usage.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
