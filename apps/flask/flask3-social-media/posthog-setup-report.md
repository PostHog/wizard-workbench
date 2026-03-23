<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. The PostHog Python SDK has been installed and configured, and 13 events have been instrumented across authentication, content creation, social engagement, and API flows. Users are identified server-side using their database ID as `distinct_id` and a `username` person property is set at login, registration, and profile update points.

## Changes made

| File | Change |
|------|--------|
| `config.py` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config vars read from environment |
| `app/__init__.py` | Added PostHog initialization (`posthog.api_key`, `posthog.host`) in `create_app()` |
| `app/auth/routes.py` | Added event tracking for login, registration, logout, and password reset flows |
| `app/main/routes.py` | Added event tracking for posts, follows, unfollows, messages, search, profile updates, and exports |
| `app/api/users.py` | Added event tracking for API-based user creation |
| `requirements.txt` | Added `posthog` dependency |
| `.env` | Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in with username and password | `app/auth/routes.py` |
| `user_registered` | Fired when a new user completes registration | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user creates a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `search_performed` | Fired when a user performs a search | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | Fired when a user triggers a post export background task | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the API | `app/api/users.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1091515)
  - [User Signups & Logins](https://us.posthog.com/project/238460/insights/I4Ama2KD) — Daily trend of logins and signups
  - [Signup to First Post Funnel](https://us.posthog.com/project/238460/insights/9V12ETUd) — Conversion from registration to first post within 7 days
  - [User Engagement Metrics](https://us.posthog.com/project/238460/insights/Fa7l8SoX) — Daily trend of posts, follows, and messages
  - [Password Reset Funnel](https://us.posthog.com/project/238460/insights/OI49tA5y) — Conversion from reset request to completion within 24 hours

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
