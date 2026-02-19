<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Flask social media microblog application. PostHog is now initialized globally in the application factory (`app/__init__.py`) using environment variables, and 12 events are captured across 3 blueprint route files covering the full user lifecycle — from registration and authentication through content creation and social engagement.

## Changes Made

### New files / configuration
- **`.env`** — Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables (gitignore-protected)
- **`config.py`** — Added `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` config variables read from environment

### Modified files
- **`requirements.txt`** — Added `posthog` dependency
- **`app/__init__.py`** — Initialized PostHog globally in `create_app()` using `posthog.api_key` and `posthog.host` (before blueprint registration)
- **`app/auth/routes.py`** — Added PostHog imports and 5 events for the full auth lifecycle
- **`app/main/routes.py`** — Added PostHog imports and 6 events for content and social actions
- **`app/api/users.py`** — Added PostHog imports and 1 event for API user creation

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully authenticates and logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user explicitly logs out of the application | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | Fired when a user creates a new microblog post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user — key social engagement event | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user — potential churn signal | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `profile_edited` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `posts_exported` | Fired when a user requests an export of their posts | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |

## Next steps

To build out your analytics dashboard in PostHog, navigate to your project and create an **"Analytics basics"** dashboard with these recommended insights:

1. **User Signup Trend** — Trend of `user_signed_up` events over time to monitor acquisition
2. **Registration → Engagement Funnel** — Funnel: `user_signed_up` → `user_logged_in` → `post_created` to track activation
3. **Social Engagement** — Trend of `user_followed` vs `user_unfollowed` events to compare growth and churn signals
4. **Content Creation Volume** — Trend of `post_created` and `message_sent` events to monitor platform activity
5. **Auth Health** — Trend of `password_reset_requested` vs `password_reset_completed` to spot friction in the auth flow

Navigate to your PostHog project at **https://us.i.posthog.com** to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
