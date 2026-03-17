<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. Here is a summary of all changes made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings fields loaded from environment variables.
- **`app/main.py`** — Initialized PostHog at app startup in the lifespan context manager using `posthog.api_key` and `posthog.host`; added `posthog.flush()` on shutdown; registered `PostHogMiddleware`.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a PostHog context and automatically identifies authenticated users by their ID.
- **`app/routers/auth.py`** — Added `user_logged_in`, `user_signed_up`, and `user_logged_out` event captures with user identification via `new_context()` / `identify_context()`.
- **`app/routers/generate.py`** — Added `content_generated` and `content_generation_failed` event captures with generation type, credit usage, and prompt length as properties.
- **`app/routers/api_keys.py`** — Added `api_key_created` and `api_key_revoked` event captures.
- **`app/routers/settings.py`** — Added `settings_updated` and `password_changed` event captures on successful changes.
- **`.env`** — Set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/routers/auth.py` |
| `user_logged_in` | User successfully logged into their account | `app/routers/auth.py` |
| `user_logged_out` | User logged out of their account | `app/routers/auth.py` |
| `content_generated` | User successfully generated AI content (blog, email, or social) | `app/routers/generate.py` |
| `content_generation_failed` | User attempted to generate content but had insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked (deactivated) an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings (email) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup-to-first-generation funnel** — Funnel: `user_signed_up` → `content_generated`. Tracks how many new users successfully generate their first piece of content.
2. **Daily active generators** — Trend: `content_generated` unique users per day, broken down by `generation_type`.
3. **Credit exhaustion rate** — Trend: `content_generation_failed` over time. Rising numbers signal users hitting credit limits — a churn risk signal.
4. **API key adoption** — Trend: `api_key_created` unique users. Indicates power users integrating the API.
5. **Login vs signup volume** — Stacked trend: `user_logged_in` and `user_signed_up` per day. Useful for understanding returning vs new user ratio.

Visit your PostHog project to build these insights: [https://us.posthog.com/project/2](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
