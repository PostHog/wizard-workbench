<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The `posthog` Python SDK is initialized globally in the application factory using the instance-based `Posthog()` constructor with `enable_exception_autocapture=True`, stored on `app.posthog_client` and accessed via `current_app.posthog_client` in all blueprints. User identification is performed at login, registration, and API user creation using `posthog_client.set()` to set person properties and `identify_context()` within a `new_context()` to tie all events in a request to the correct user. A graceful shutdown hook is registered with `atexit` to ensure all queued events are flushed. PostHog credentials are loaded from environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) via `.env`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registers an account | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via reset link | `app/auth/routes.py` |
| `post_created` | A user publishes a new post to their feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a direct message to another user | `app/main/routes.py` |
| `post_search_performed` | A user performs a post search | `app/main/routes.py` |
| `post_translation_requested` | A user requests translation of a post | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | A user triggers the background task to export their posts | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | A user obtains an API authentication token | `app/api/tokens.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup-to-login conversion funnel** — Funnel: `user_signed_up` → `user_logged_in`. Shows onboarding conversion rate.
2. **Daily active users** — Trends: `user_logged_in` unique users over time. Core engagement metric.
3. **Content creation trend** — Trends: `post_created` count over time. Measures platform activity.
4. **Social engagement** — Trends: `user_followed` + `message_sent` counts over time. Tracks social graph growth.
5. **Churn signals** — Trends: `user_logged_out` vs `user_logged_in` ratio over time. Surfaces session abandonment patterns.

You can create this dashboard at [/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
