<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Microblog Flask social media application. The `posthog` Python SDK was installed and initialized in `app/__init__.py` using the `Posthog()` class constructor with `enable_exception_autocapture=True`. A module-level `posthog_client` instance is shared across all blueprints, and `posthog_client.shutdown` is registered with `atexit` to ensure all queued events are flushed when the application exits. User identity is established on login and registration using `posthog_client.set()` to create person profiles, and events use `str(user.id)` as the stable `distinct_id`. Error tracking is wired into the 500 error handler via `posthog_client.capture_exception()`. Environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are loaded from `.env` via `python-dotenv`.

| Event | Description | File |
|-------|-------------|------|
| `user_registered` | Fired when a new user completes registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | Fired when a user successfully logs in | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user submits a password reset request | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password | `app/auth/routes.py` |
| `post_created` | Fired when a user creates a new post | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message | `app/main/routes.py` |
| `search_performed` | Fired when a user performs a search | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves profile changes | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API | `app/api/users.py` |
| `api_token_created` | Fired when an API token is issued | `app/api/tokens.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights based on the events we just instrumented:

1. **User Acquisition Funnel** — Funnel insight: `user_registered` → `user_logged_in`. Measures how many newly registered users go on to log in.
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

2. **New Registrations Over Time** — Trend insight: `user_registered` count per day. Tracks growth of new signups.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

3. **Content Creation Activity** — Trend insight: `post_created` count per day. Monitors how actively users are posting.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Social Engagement** — Trend insight: `user_followed` and `message_sent` broken down over time. Shows community interaction health.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **Churn Signal — Password Reset Rate** — Trend insight: `password_reset_requested` over time, compared to `user_logged_in`. A spike in resets relative to logins can signal friction or account issues.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

To build the dashboard: go to [Dashboards](https://us.posthog.com/project/2/dashboard) → **New dashboard** → name it "Analytics basics" → add each insight above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
