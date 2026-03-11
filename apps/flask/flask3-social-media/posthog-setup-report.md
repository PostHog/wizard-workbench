<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). The PostHog Python SDK (`posthog`) has been installed and initialized in the application factory using the `Posthog()` class constructor. The client is stored on `app.posthog` and is available via `current_app.posthog` throughout all blueprints. An `atexit` handler is registered to flush all events on shutdown.

Environment variables `POSTHOG_KEY` and `POSTHOG_HOST` have been set in `.env` and are read via `config.py`. Keys are never hardcoded.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes registration | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `search_performed` | Fired when a user performs a search | `app/main/routes.py` |
| `posts_export_started` | Fired when a user triggers the export posts task | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |

## Files modified

- `app/__init__.py` — PostHog `Posthog()` initialization, stored as `app.posthog`, atexit shutdown registered
- `app/auth/routes.py` — Events on login, signup, logout, password reset request/completion; person properties set via `posthog.set()`
- `app/main/routes.py` — Events on post creation, follow/unfollow, message sending, profile update, search, export
- `app/api/users.py` — Event on API user creation with person property set
- `config.py` — Added `POSTHOG_KEY` and `POSTHOG_HOST` config values
- `requirements.txt` — Added `posthog` dependency
- `.env` — Added `POSTHOG_KEY` and `POSTHOG_HOST` (gitignore-covered)

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/2/dashboard/1350002
- **User Signups Trend:** https://us.posthog.com/project/2/insights/b999cord
- **Signup to Engagement Funnel:** https://us.posthog.com/project/2/insights/mkn342oc
- **Social Engagement (follows, messages, posts):** https://us.posthog.com/project/2/insights/5lxb7322
- **Daily Active Users (logins):** https://us.posthog.com/project/2/insights/j9evpnht
- **Churn Indicator (logouts):** https://us.posthog.com/project/2/insights/svxu5pc3

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
