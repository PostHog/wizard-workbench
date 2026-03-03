<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. PostHog is now initialized in the application factory (`app/__init__.py`) using environment-variable-backed configuration, and 14 events are instrumented across authentication, social, messaging, and API flows. All events use the `new_context()` / `identify_context()` pattern to ensure user identity is correlated with every event. Secrets are stored in `.env` (gitignore-covered) and referenced via `config.py`. The `posthog` package has been added to `requirements.txt` and a shutdown hook is registered with `atexit` to guarantee event flushing on process exit.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via the web login form | `app/auth/routes.py` |
| `user_logged_out` | User explicitly logged out of their session | `app/auth/routes.py` |
| `user_signed_up` | User successfully registered a new account via the web form | `app/auth/routes.py` |
| `password_reset_requested` | User submitted a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password via the token link | `app/auth/routes.py` |
| `post_created` | User submitted a new post on the home feed | `app/main/routes.py` |
| `user_followed` | User followed another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollowed another user | `app/main/routes.py` |
| `message_sent` | User sent a private message to another user | `app/main/routes.py` |
| `post_export_started` | User initiated a background export of all their posts | `app/main/routes.py` |
| `search_performed` | User performed a full-text search | `app/main/routes.py` |
| `post_translated` | User triggered translation of a post | `app/main/routes.py` |
| `api_user_created` | A new user account was created via the REST API | `app/api/users.py` |
| `api_token_created` | An API authentication token was generated for a user | `app/api/tokens.py` |

## Next steps

To explore the data captured by these events, create an **"Analytics basics"** dashboard in PostHog at https://us.posthog.com/project/2/dashboards with the following recommended insights:

1. **Signup Conversion Funnel** — Funnel from `user_signed_up` → `user_logged_in`, showing drop-off between registration and first login.
2. **New User Signups Over Time** — Trend of `user_signed_up` + `api_user_created` to track daily acquisition from both web and API channels.
3. **Social Engagement** — Trend of `user_followed` + `message_sent` to measure how connected users are becoming over time.
4. **Content Activity** — Trend of `post_created` + `search_performed` + `post_translated` to gauge active content creation and discovery.
5. **Churn Signal** — Trend of `user_unfollowed` to surface early signs of social disengagement.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
