<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. Here is a summary of all changes made:

**`app/config.py`** — Added three new Pydantic Settings fields: `posthog_project_token`, `posthog_host`, and `posthog_disabled`. These are loaded from environment variables via the `.env` file, keeping secrets out of source code.

**`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values. The file is covered by `.gitignore`.

**`requirements.txt`** — Added `posthog>=3.0.0` as a project dependency.

**`app/main.py`** — Imported PostHog and `PostHogMiddleware`. In the `lifespan` context manager, PostHog is initialized on startup (`posthog.api_key`, `posthog.host`, `posthog.debug`) and flushed on shutdown (`posthog.flush()`). The `PostHogMiddleware` is registered with the app.

**`app/middleware.py`** — Implemented `PostHogMiddleware` as a pure ASGI middleware. It wraps each HTTP request in a `new_context()`, reads the session cookie to identify authenticated users, and calls `identify_context(user_id)` so all route-level `capture()` calls are automatically attributed to the right user.

**`app/routers/auth.py`** — Added `posthog.identify()` + `posthog.capture()` on successful login (`user_logged_in`) and signup (`user_signed_up`). Added `posthog.capture("anonymous", "login_failed")` on failed login attempts. Added `capture("user_logged_out")` on logout.

**`app/routers/generate.py`** — Added `capture("insufficient_credits", ...)` when a user lacks credits for generation, and `capture("content_generated", ...)` after a successful generation, including `generation_type`, `credits_used`, and `credits_remaining` properties.

**`app/routers/api_keys.py`** — Added `capture("api_key_created", ...)` after a new key is successfully created, and `capture("api_key_revoked")` after a key is deactivated.

**`app/routers/settings.py`** — Added `capture("settings_updated", ...)` when a user successfully changes their email, and `capture("password_changed")` when a password is changed successfully.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account via the signup form | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form | `app/routers/auth.py` |
| `login_failed` | Fired when a login attempt fails due to invalid credentials | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated; includes generation_type, credits_used, credits_remaining | `app/routers/generate.py` |
| `insufficient_credits` | Fired when a user attempts to generate content but lacks credits; includes generation_type, credits_needed, credits_available | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |

## Next steps

We've instrumented 10 business-critical events covering the full user lifecycle. To build insights in PostHog, head to your project and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Signup-to-first-generation funnel** — Funnel: `user_signed_up` → `content_generated`
2. **Content generation volume by type** — Trend: `content_generated` broken down by `generation_type`
3. **Login failure rate** — Trend: `login_failed` vs `user_logged_in` over time
4. **Credit exhaustion events** — Trend: `insufficient_credits` over time (leading churn indicator)
5. **API key adoption** — Trend: `api_key_created` vs total active users (developer engagement)

Visit your PostHog project at https://us.posthog.com/project/2 to get started.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
