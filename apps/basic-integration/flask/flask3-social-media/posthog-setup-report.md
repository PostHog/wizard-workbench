<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (Microblog) application. The `posthog` Python SDK was installed and configured via environment variables. PostHog is initialized in `create_app()` using the project token and host from `.env`. Thirteen events were added across four files covering all critical user flows: authentication, social actions (follow/unfollow), content creation, messaging, profile management, search, and the REST API. Exception capture was added to the global 500 error handler.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user successfully creates an account via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their account | `app/auth/routes.py` |
| `password_reset_requested` | A user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully resets their password via a reset token | `app/auth/routes.py` |
| `post_created` | A user creates a new post on the feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile | `app/main/routes.py` |
| `search_performed` | A user performs a post search | `app/main/routes.py` |
| `posts_export_started` | A user starts the background job to export their posts | `app/main/routes.py` |
| `user_created_via_api` | A new user is created through the REST API | `app/api/users.py` |

## Next steps

To monitor user behavior, create a dashboard named **"Analytics basics (wizard)"** in PostHog with the following recommended insights:

1. **Registration → Login funnel** — Funnel from `user_registered` → `user_logged_in` to measure onboarding conversion
2. **Post creation trend** — Trends chart of `post_created` over time to track content engagement
3. **Social engagement** — Trends chart of `user_followed` and `user_unfollowed` side by side
4. **Daily active users** — Unique users trend across all key events
5. **Error rate** — Trend of 500 errors captured via exception tracking

[Create your dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
