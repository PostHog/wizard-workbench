<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is initialized as an instance-based client (`Posthog()`) in the application factory and stored on the `app` object, following Flask conventions (same pattern as `app.elasticsearch`). An `atexit` handler ensures all queued events are flushed cleanly on shutdown. Environment variables are used for all PostHog configuration — no keys are hardcoded.

**Files changed:**

- `requirements.txt` — added `posthog` dependency
- `config.py` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config keys read from environment
- `.env` — populated `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`
- `app/__init__.py` — initialized `Posthog()` client with `enable_exception_autocapture=True` and registered `atexit` shutdown handler
- `app/auth/routes.py` — added user identification and event capture for login, signup, logout, and password reset flows
- `app/main/routes.py` — added event capture for post creation, follow/unfollow, message sending, profile updates, and data export
- `app/api/tokens.py` — added event capture for API token creation

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Triggered when a new user successfully completes registration | `app/auth/routes.py` |
| `user_logged_in` | Triggered when an existing user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Triggered when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Triggered when a user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | Triggered when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Triggered when a user successfully submits a new post | `app/main/routes.py` |
| `user_followed` | Triggered when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Triggered when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Triggered when a user successfully sends a direct message | `app/main/routes.py` |
| `profile_updated` | Triggered when a user saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | Triggered when a user initiates a post data export | `app/main/routes.py` |
| `api_token_created` | Triggered when a user obtains an API token via the REST API | `app/api/tokens.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Signup-to-Login funnel** — Conversion funnel: `user_signed_up` → `user_logged_in`
   - [Create insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMIiwiZmlsdGVycyI6eyJldmVudHMiOlt7ImlkIjoidXNlcl9zaWduZWRfdXAiLCJ0eXBlIjoiZXZlbnRzIn0seyJpZCI6InVzZXJfbG9nZ2VkX2luIiwidHlwZSI6ImV2ZW50cyJ9XX19)

2. **Daily new signups** — Trend of `user_signed_up` over time
   - [Create insight](https://us.posthog.com/project/2/insights/new)

3. **Post creation volume** — Trend of `post_created` events over time
   - [Create insight](https://us.posthog.com/project/2/insights/new)

4. **Social engagement** — Trend of `user_followed` + `user_unfollowed` together
   - [Create insight](https://us.posthog.com/project/2/insights/new)

5. **Message volume** — Trend of `message_sent` over time
   - [Create insight](https://us.posthog.com/project/2/insights/new)

You can create your dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
