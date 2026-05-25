<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (microblog). The `posthog` Python SDK is initialized once in `create_app()` using the instance-based `Posthog()` constructor with `enable_exception_autocapture=True`. A shutdown hook is registered via `atexit` to ensure all events are flushed on exit. PostHog credentials are read from environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) — never hardcoded. Events are captured across authentication flows, social interactions, messaging, and API endpoints. User identification is called at login, registration, and API user creation to correlate events to specific users.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user successfully completes registration | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a password reset request by email | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | A user publishes a new post on the feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background task to export their posts | `app/main/routes.py` |
| `api_user_created` | A new user is created via the REST API | `app/api/users.py` |
| `api_token_revoked` | An API token is revoked via the REST API | `app/api/tokens.py` |

Error tracking is added to `app/errors/handlers.py`: the 500 error handler calls `posthog_client.capture_exception()` with the authenticated user's username (or `"anonymous"`) as the distinct ID.

## Next steps

We've set up a comprehensive event tracking foundation. You can now build insights and a dashboard in PostHog to monitor user behavior:

- [PostHog Dashboards](/dashboard) — create an "Analytics basics" dashboard with the events above
- [New Trends insight](/insights/new?insight=TRENDS) — plot `user_registered`, `user_logged_in`, and `post_created` over time to track growth and engagement
- [New Funnel insight](/insights/new?insight=FUNNELS) — build a registration-to-first-post funnel: `user_registered` → `post_created`
- [New Funnel insight](/insights/new?insight=FUNNELS) — build a social engagement funnel: `user_registered` → `user_followed` → `message_sent`
- [Error tracking](/error_tracking) — view captured 500 exceptions from the error handler

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
