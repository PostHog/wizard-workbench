<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask application. PostHog is now initialised once in `app/__init__.py` via the application factory, with the API key and host loaded from environment variables. Fifteen events are tracked across six files covering the complete user lifecycle — from registration and login through content creation, social interactions, messaging, search, and API access — alongside automatic exception capture on 500 errors.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via the reset link | `app/auth/routes.py` |
| `post_created` | A user publishes a new post to their feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile (username or bio) | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `search_performed` | A user performs a post search | `app/main/routes.py` |
| `post_translated` | A user requests translation of a post | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background job to export their posts | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API | `app/api/users.py` |
| `api_token_issued` | An API authentication token is issued to a user | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1095766)
- [User Acquisition Trend](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=[{"id":"user_registered","name":"Registrations"},{"id":"api_user_created","name":"API Registrations"}]) — `user_registered` + `api_user_created` over time
- [User Engagement Funnel](https://us.posthog.com/project/238460/insights/new#insight=FUNNELS&events=[{"id":"user_registered"},{"id":"user_logged_in"},{"id":"post_created"},{"id":"user_followed"}]) — activation funnel from registration → login → post → follow
- [Social Activity](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=[{"id":"post_created","name":"Posts"},{"id":"message_sent","name":"Messages"},{"id":"user_followed","name":"Follows"}]) — content creation and social engagement over time
- [Churn Signals](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=[{"id":"user_logged_out","name":"Logouts"},{"id":"user_unfollowed","name":"Unfollows"}]) — user disengagement indicators

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
