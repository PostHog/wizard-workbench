<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblogging application (based on Miguel Grinberg's Microblog). PostHog's Python SDK was installed and initialized globally in the application factory (`app/__init__.py`) using environment-variable-backed configuration. User identification is performed on login and registration using `new_context()` and `identify_context()`, tying person properties (email, username) to all subsequent events. Fourteen events were instrumented across five files covering the full user lifecycle — authentication, content creation, social interactions, messaging, and API usage.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with their username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via reset token | `app/auth/routes.py` |
| `post_created` | A user submits a new post on the feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_edited` | A user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | A user initiates a post export background task | `app/main/routes.py` |
| `api_user_created` | A new user is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | A user obtains an API authentication token | `app/api/tokens.py` |
| `api_token_revoked` | A user revokes their API authentication token | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **[Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1091515)** — Core analytics for the Microblog Flask application
  - **[User Signups & Logins](https://us.posthog.com/project/238460/insights/I4Ama2KD)** — Daily trend of signups and logins over 30 days
  - **[Signup to First Post Funnel](https://us.posthog.com/project/238460/insights/9V12ETUd)** — Conversion from signup to creating a first post within 7 days
  - **[User Engagement Metrics](https://us.posthog.com/project/238460/insights/Fa7l8SoX)** — Daily trend of posts created, follows, and messages sent
  - **[Password Reset Funnel](https://us.posthog.com/project/238460/insights/OI49tA5y)** — Conversion from password reset request to completion within 24 hours

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
