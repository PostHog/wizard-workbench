<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (Microblog) application. Here is a summary of all changes made:

- **`requirements.txt`** — Added `posthog` dependency
- **`config.py`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config keys, read from environment variables
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (covered by .gitignore)
- **`app/__init__.py`** — Initialized a `Posthog()` client instance in `create_app()` with `enable_exception_autocapture=True`, stored on `app.posthog_client`, and registered `atexit` shutdown to flush all events on exit
- **`app/auth/routes.py`** — Added event capture and user identification on login, logout, registration, password reset request, and password reset completion
- **`app/main/routes.py`** — Added event capture for post creation, follow/unfollow, message sent, profile updated, and posts export started
- **`app/api/users.py`** — Added event capture and user identification when a user is created via the REST API
- **`app/api/tokens.py`** — Added event capture when an API token is issued

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | User successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User logs out of the application | `app/auth/routes.py` |
| `password_reset_requested` | User requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | User successfully resets their password via a token link | `app/auth/routes.py` |
| `post_created` | User submits a new post from the home feed | `app/main/routes.py` |
| `user_followed` | User follows another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user | `app/main/routes.py` |
| `message_sent` | User successfully sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | User saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | User triggers the background task to export their posts | `app/main/routes.py` |
| `api_user_created` | New user account is created via the REST API | `app/api/users.py` |
| `api_token_issued` | API authentication token is successfully issued to a user | `app/api/tokens.py` |

## Next steps

We've set up your PostHog project with the events above. You can explore them in PostHog using these links:

- **Dashboard**: https://us.posthog.com/project/2/dashboard/1346453
- **Signup trend** (user_signed_up over time): https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up"}]}
- **Activation funnel** (signup → first post → follow): https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up"},{"id":"post_created"},{"id":"user_followed"}]}
- **Engagement trend** (posts + messages + follows): https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post_created"},{"id":"message_sent"},{"id":"user_followed"}]}
- **Churn signals** (logouts + unfollows): https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_out"},{"id":"user_unfollowed"}]}
- **API adoption** (API registrations + token issuance): https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"api_user_created"},{"id":"api_token_issued"}]}

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
