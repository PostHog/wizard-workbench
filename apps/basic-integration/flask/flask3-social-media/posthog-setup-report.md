<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog social media application. PostHog is initialized globally in `create_app()` using the module-level `posthog.api_key` and `posthog.host` configuration, with `atexit` shutdown registered to ensure all events are flushed on exit. Environment variables are stored in `.env` and read via `python-dotenv`. The `posthog` package has been added to `requirements.txt`.

Event tracking has been added across five files covering the full user lifecycle — from registration and login, to content creation, social engagement, messaging, and API usage.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user registers via the web form | `app/auth/routes.py` |
| `user_logged_in` | User logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User logs out | `app/auth/routes.py` |
| `password_reset_requested` | User submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | User successfully resets their password | `app/auth/routes.py` |
| `post_created` | User publishes a new microblog post | `app/main/routes.py` |
| `user_followed` | User follows another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user | `app/main/routes.py` |
| `message_sent` | User sends a private message | `app/main/routes.py` |
| `profile_updated` | User saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | User initiates a posts export task | `app/main/routes.py` |
| `search_performed` | User submits a search query | `app/main/routes.py` |
| `api_token_created` | User generates an API token | `app/api/tokens.py` |
| `api_user_created` | New user created via the REST API | `app/api/users.py` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

- **User Registration Funnel** — Funnel from `user_signed_up` → `user_logged_in` → `post_created`. Shows how many new users activate and start posting.
- **Daily Active Users** — Unique users per day across `user_logged_in`, `post_created`, `message_sent`. Tracks engagement.
- **Content & Social Engagement** — Trend of `post_created`, `user_followed`, `message_sent`. Measures platform activity.
- **Search Usage** — Trend of `search_performed` with `result_count` property breakdown. Helps understand discoverability.
- **API Adoption** — Trend of `api_token_created` and `api_user_created`. Tracks developer/API usage.

Build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
