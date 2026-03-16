<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask Microblog application. The `posthog` Python SDK was added as a dependency, initialized in the app factory (`app/__init__.py`) using the `Posthog()` constructor with `enable_exception_autocapture=True`, and graceful shutdown is registered via `atexit`. PostHog configuration is read from environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) set in `.env`. Event tracking was added across the auth, main, and API blueprints, covering the full user lifecycle from registration through engagement actions.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of the application | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via token link | `app/auth/routes.py` |
| `post_created` | A user submits a new post to their feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background export of their posts | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | A user obtains an API authentication token | `app/api/tokens.py` |
| `api_token_revoked` | A user revokes their API authentication token | `app/api/tokens.py` |

## Next steps

We've instrumented key user actions across your app. To build analytics insights, visit your PostHog project and create an **"Analytics basics"** dashboard with these suggested insights:

1. **Registration-to-login funnel** — Funnel: `user_registered` → `user_logged_in` → `post_created`
2. **Daily active users** — Unique users who triggered any event, trended over time
3. **Engagement: posts & messages** — `post_created` and `message_sent` event counts over time
4. **Social graph growth** — `user_followed` vs `user_unfollowed` counts (net follower growth)
5. **API adoption** — `api_user_created` and `api_token_obtained` counts over time

Visit your project: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
