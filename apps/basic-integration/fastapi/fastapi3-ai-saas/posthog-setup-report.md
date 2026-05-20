<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this FastAPI SaaS application. Here's a summary of every change made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings (loaded from environment variables via Pydantic Settings).
- **`app/main.py`** — Initialized PostHog in the `lifespan` context manager on startup (`posthog.api_key`, `posthog.host`, `posthog.debug`) and flushed events on shutdown (`posthog.flush()`). Added `PostHogMiddleware` to the app.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI, no `BaseHTTPMiddleware` overhead): wraps every HTTP request in a `new_context()`, reads the session cookie to identify the authenticated user, and calls `identify_context()` + `tag()` so that all downstream `capture()` calls are automatically associated with the correct user.
- **`app/routers/auth.py`** — Added `user_signed_up` (with user identification), `user_logged_in` (with user identification), `login_failed`, and `user_logged_out` events.
- **`app/routers/generate.py`** — Added `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`) and `insufficient_credits` (with `generation_type`, `credits_needed`, `credits_available`) events.
- **`app/routers/api_keys.py`** — Added `api_key_created` (with `active_key_count`) and `api_key_revoked` events.
- **`app/routers/settings.py`** — Added `settings_updated` (with `field_changed`) and `password_changed` events.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account via the signup form | `app/routers/auth.py` |
| `user_logged_in` | Fired when an existing user successfully authenticates via the login form | `app/routers/auth.py` |
| `login_failed` | Fired when a login attempt fails due to invalid credentials | `app/routers/auth.py` |
| `user_logged_out` | Fired when an authenticated user logs out | `app/routers/auth.py` |
| `content_generated` | Fired when a user successfully generates AI content; includes `generation_type`, `credits_used`, `credits_remaining` | `app/routers/generate.py` |
| `insufficient_credits` | Fired when a generation attempt fails due to insufficient credits (key churn signal); includes `generation_type`, `credits_needed`, `credits_available` | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key; includes `active_key_count` | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their profile email; includes `field_changed` | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've set up PostHog tracking across all key user flows. Build an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup → Generation Funnel** — Funnel insight: `user_signed_up` → `content_generated`. Tracks new user conversion into paying product usage.
2. **New Signups Over Time** — Trend insight on `user_signed_up`. Monitor acquisition rate.
3. **Content Generation by Type** — Trend insight on `content_generated`, broken down by `generation_type` (`blog`, `email`, `social`). See which content types drive the most usage.
4. **Insufficient Credits Rate** — Trend insight on `insufficient_credits`. This is your top churn-risk indicator: users who hit this wall and don't get more credits are likely to churn.
5. **API Key Activity** — Trend insight showing `api_key_created` and `api_key_revoked` side-by-side. Indicates developer/power user engagement.

Go to your project to build the dashboard:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboards)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
