<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The PostHog Python SDK is initialized as an instance-based client (`Posthog()`) in the application factory (`create_app()`), stored on the app object as `app.posthog`, and accessed in blueprints via `current_app.posthog`. User identity is tracked using the stable numeric user ID as `distinct_id`, with person properties (username) set via `posthog_client.set()`. No PII is included in event properties. Exception autocapture is enabled at init, and a manual `capture_exception()` call is added to the 500 error handler. An `atexit` hook ensures all queued events flush on shutdown.

| Event Name | Description | File |
|---|---|---|
| `user_registered` | Fired when a new user completes registration via the web form. | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form. | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out of their session. | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request email. | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via the reset token. | `app/auth/routes.py` |
| `post_created` | Fired when a user successfully submits a new post on the feed. | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user. | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user. | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile. | `app/main/routes.py` |
| `search_performed` | Fired when a user executes a search query. | `app/main/routes.py` |
| `post_translation_requested` | Fired when a user requests translation of a post. | `app/main/routes.py` |
| `posts_export_started` | Fired when a user triggers the background task to export their posts. | `app/main/routes.py` |
| `api_user_created` | Fired when a new user account is created via the REST API. | `app/api/users.py` |
| `api_token_issued` | Fired when a user obtains an API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818060)
- [User registrations over time](https://us.posthog.com/project/483112/insights/lZKKvH6r) — Web and API registrations as a daily line chart
- [Registration to first post funnel](https://us.posthog.com/project/483112/insights/FliJbz7T) — Conversion from signup → login → first post
- [Social engagement events](https://us.posthog.com/project/483112/insights/dtHHFKZn) — Posts created, follows, and messages sent per day
- [User retention after registration](https://us.posthog.com/project/483112/insights/rX6rfIpP) — Weekly cohort retention tracking return logins
- [Authentication events](https://us.posthog.com/project/483112/insights/dOaIo9W3) — Daily active logins, logouts, and password reset requests

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the login handler sets person properties on successful login, but sessions that are already authenticated when the server restarts will not re-identify until the next explicit login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
