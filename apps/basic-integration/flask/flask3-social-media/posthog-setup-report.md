<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask microblog social media application. PostHog is initialized globally in `create_app()` using module-level configuration (`posthog.api_key` / `posthog.host`), with `atexit` shutdown registered to ensure all events are flushed when the server exits. The Python SDK's `new_context()` / `identify_context()` pattern is used throughout, linking every captured event to an authenticated user's stable numeric ID. Error tracking is wired into Flask's 500 error handler via `posthog.capture_exception()`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully completed registration via the web form | `app/auth/routes.py` |
| `user_logged_in` | An existing user successfully logged in with username and password | `app/auth/routes.py` |
| `user_logged_out` | A user logged out of their account | `app/auth/routes.py` |
| `password_reset_requested` | A user requested a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully reset their password via the reset token link | `app/auth/routes.py` |
| `post_created` | A user submitted a new post to their feed | `app/main/routes.py` |
| `user_followed` | A user followed another user | `app/main/routes.py` |
| `user_unfollowed` | A user unfollowed another user | `app/main/routes.py` |
| `message_sent` | A user sent a private message to another user | `app/main/routes.py` |
| `profile_updated` | A user saved changes to their profile | `app/main/routes.py` |
| `post_export_started` | A user triggered an export of their posts as a background task | `app/main/routes.py` |
| `api_token_created` | An API token was issued via the REST API (POST /api/tokens) | `app/api/tokens.py` |
| `api_user_created` | A new user account was created via the REST API (POST /api/users) | `app/api/users.py` |

## Files modified

| File | Changes |
|---|---|
| `requirements.txt` | Added `posthog` dependency |
| `config.py` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` config vars |
| `app/__init__.py` | Initialized PostHog globally in `create_app()`; registered `atexit` shutdown |
| `app/auth/routes.py` | Added `user_signed_up`, `user_logged_in`, `user_logged_out`, `password_reset_requested`, `password_reset_completed` events with user identification |
| `app/main/routes.py` | Added `post_created`, `user_followed`, `user_unfollowed`, `message_sent`, `profile_updated`, `post_export_started` events |
| `app/api/tokens.py` | Added `api_token_created` event |
| `app/api/users.py` | Added `api_user_created` event |
| `app/errors/handlers.py` | Added `posthog.capture_exception()` in the 500 error handler |
| `.env` | Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **User acquisition funnel** — Funnel: `user_signed_up` → `user_logged_in` → `post_created`
   Track how many new users complete the full onboarding journey from registration to first post.

2. **Daily active users** — Trend: `user_logged_in` (unique users) over time
   Monitor daily/weekly engagement and spot retention drops early.

3. **Content creation rate** — Trend: `post_created` (event count) over time
   Measure platform health by tracking how much content users are producing.

4. **Social engagement** — Trend: `user_followed` and `user_unfollowed` side-by-side
   Compare growth vs churn in the follower graph to understand network health.

5. **Messaging activity** — Trend: `message_sent` (event count) over time
   Track direct messaging as a leading indicator of deep engagement.

Go to [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create the dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
