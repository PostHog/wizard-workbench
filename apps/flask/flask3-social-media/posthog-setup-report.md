<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media (microblog) application. The `posthog` Python SDK has been added as a dependency and initialized globally in the application factory (`app/__init__.py`). Configuration is handled via environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) sourced from `.env`. Event tracking has been instrumented across auth routes, main social features, and REST API endpoints, covering the full user lifecycle from registration through content creation, social interactions, and API usage.

| Event | Description | File |
|---|---|---|
| `user_registered` | A new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | A user successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logs out of their session | `app/auth/routes.py` |
| `password_reset_requested` | A user requests a password reset email | `app/auth/routes.py` |
| `post_created` | A user creates and publishes a new post to their feed | `app/main/routes.py` |
| `user_followed` | A user follows another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollows another user | `app/main/routes.py` |
| `message_sent` | A user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saves changes to their profile (username or about_me) | `app/main/routes.py` |
| `post_search_performed` | A user submits a full-text search query | `app/main/routes.py` |
| `posts_export_started` | A user initiates a background task to export their posts | `app/main/routes.py` |
| `api_user_created` | A new user account is created via the REST API | `app/api/users.py` |
| `api_token_obtained` | A user obtains an API authentication token | `app/api/tokens.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

1. **Registration → Login funnel** — Funnel insight with steps: `user_registered` → `user_logged_in`. Measures how many newly registered users proceed to log in.
2. **New user registrations over time** — Trend insight tracking `user_registered` per day/week. Core growth metric.
3. **Content engagement** — Trend insight with `post_created`, `message_sent`, and `user_followed` on the same chart. Shows which social features are most used.
4. **Search usage** — Trend insight for `post_search_performed`. Indicates how often users rely on full-text search.
5. **Churn signals** — Trend insight comparing `user_logged_in` vs `user_logged_out` and `user_unfollowed`. Highlights disengagement patterns.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
