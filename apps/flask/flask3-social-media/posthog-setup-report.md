<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Flask 3 social media (Microblog) application. The following changes were made:

- **`app/__init__.py`** — PostHog is initialised globally in `create_app()` using `posthog.api_key` and `posthog.host` read from the app config, with `posthog.shutdown` registered via `atexit` to ensure all events are flushed on exit.
- **`config.py`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config keys added, reading from environment variables.
- **`.env`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables written.
- **`requirements.txt`** — `posthog` package added.
- **`app/auth/routes.py`** — User identification and event capture added for login, registration, logout, and the two-step password-reset flow.
- **`app/main/routes.py`** — Event capture added for post creation, follow/unfollow actions, profile updates, private messages, and post exports.
- **`app/api/users.py`** — Event capture added for user registration via the REST API.

All events use `new_context()` / `identify_context()` / `capture()` from the PostHog Python SDK. Person properties (usernames) are set with `tag()`. No PII is written into event properties.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | A new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | A user submits a new post to the feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile | `app/main/routes.py` |
| `post_export_started` | A user initiates a background export of their posts | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API | `app/api/users.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/238460/dashboard/1091515
  - **User Signups & Logins** (daily trend): https://us.posthog.com/project/238460/insights/I4Ama2KD
  - **Signup to First Post Funnel** (conversion funnel): https://us.posthog.com/project/238460/insights/9V12ETUd
  - **User Engagement Metrics** (posts, follows, messages): https://us.posthog.com/project/238460/insights/Fa7l8SoX
  - **Password Reset Funnel** (request → completion): https://us.posthog.com/project/238460/insights/OI49tA5y

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
