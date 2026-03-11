<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`app/config.py`** — Added `posthog_key`, `posthog_host`, and `posthog_disabled` settings, loaded from environment variables via Pydantic Settings.
- **`app/main.py`** — Initialized PostHog in the `lifespan` context manager (startup: `posthog.api_key`, `posthog.host`; shutdown: `posthog.flush()`). Added `PostHogMiddleware` to the app.
- **`app/middleware.py`** — Created `PostHogMiddleware` (pure ASGI, no `BaseHTTPMiddleware` overhead). On each authenticated request, the middleware opens a `new_context()`, calls `identify_context(str(user.id))`, and tags `email` — so all events captured in route handlers are automatically attributed to the correct user.
- **`app/routers/auth.py`** — Added `user_signed_up`, `user_logged_in`, and `user_logged_out` events with `identify_context` calls at login/signup to associate future events with the user.
- **`app/routers/generate.py`** — Added `content_generated` event (tracks `generation_type`, `credits_used`, `credits_remaining`) and `insufficient_credits` event (churn signal, tracks `generation_type`, `credits_needed`, `credits_available`).
- **`app/routers/api_keys.py`** — Added `api_key_created` and `api_key_revoked` events.
- **`app/routers/settings.py`** — Added `settings_updated` (on email change) and `password_changed` events.
- **`app/routers/pages.py`** — Added `dashboard_viewed` event (top-of-funnel: user has logged in and reached their dashboard).
- **`requirements.txt`** — Added `posthog>=3.0.0`.
- **`.env`** — Set `POSTHOG_KEY` and `POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes registration | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticates | `app/routers/auth.py` |
| `user_logged_out` | User logs out | `app/routers/auth.py` |
| `content_generated` | AI content generation completes (type, credits used/remaining) | `app/routers/generate.py` |
| `insufficient_credits` | User attempts generation but lacks credits (churn signal) | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User revokes an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updates account settings (e.g. email) | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password | `app/routers/settings.py` |
| `dashboard_viewed` | User lands on their dashboard (top of conversion funnel) | `app/routers/pages.py` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with the following insights to track key business metrics:

1. **Signup conversion funnel** — `user_signed_up` → `dashboard_viewed` → `content_generated` (shows where users drop off after registering)
2. **Daily new signups** — Trend of `user_signed_up` over time (user acquisition)
3. **Content generation by type** — Breakdown of `content_generated` by `generation_type` property (blog vs email vs social)
4. **Churn signals** — Trend of `insufficient_credits` events (users running out of credits, indicating upgrade candidates)
5. **Active users retention** — Weekly unique users who triggered `content_generated` (engagement/retention)

Visit [PostHog Project 2 Dashboards](https://us.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
