# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been instrumented across the Acme AI SaaS FastAPI application. The integration uses the instance-based `Posthog()` class constructor, initialized in the FastAPI lifespan context manager for proper startup/shutdown handling. A custom ASGI middleware (`PostHogMiddleware`) wraps every HTTP request in a `new_context()` call and automatically identifies authenticated users via their session cookie — meaning all events captured within a request are automatically associated with the logged-in user without any manual wiring in route handlers. Nine business-critical events were added across four router files, covering the full user lifecycle: acquisition, AI content usage, API key management, and account settings changes.

Key changes made:

- **`app/config.py`** — Added `posthog_key`, `posthog_host`, and `posthog_disabled` fields to the Pydantic Settings class
- **`app/main.py`** — Initialized `Posthog()` client in the lifespan context manager with `enable_exception_autocapture=True`; added `PostHogMiddleware` to the app
- **`app/middleware.py`** — New pure ASGI `PostHogMiddleware` that calls `new_context()` per request and `identify_context(str(user.id))` for authenticated users
- **`app/routers/auth.py`** — Added `user_signed_up`, `user_logged_in`, `user_logged_out` captures
- **`app/routers/generate.py`** — Added `content_generated` and `insufficient_credits` captures with credit metadata
- **`app/routers/api_keys.py`** — Added `api_key_created` and `api_key_revoked` captures
- **`app/routers/settings.py`** — Added `settings_updated` and `password_changed` captures
- **`requirements.txt`** — Added `posthog>=3.0.0`
- **`.env`** — Set `POSTHOG_KEY` and `POSTHOG_HOST`

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/routers/auth.py` |
| `content_generated` | Fired when a user successfully generates AI content; includes `generation_type` and `credits_used` | `app/routers/generate.py` |
| `insufficient_credits` | Fired when a generation request is rejected due to insufficient credits; helps track churn risk | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings (e.g. email change) | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803)
  - [User Acquisition — signups & sign-ins trend](https://us.posthog.com/project/2/insights/pfv4PACB)
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb)
  - [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy)
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI)
  - [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
