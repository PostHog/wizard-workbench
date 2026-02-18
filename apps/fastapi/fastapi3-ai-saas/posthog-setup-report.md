<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Acme AI FastAPI SaaS application. Here's what was done:

## Summary of Changes

- **`app/config.py`** — Added `posthog_api_key`, `posthog_host`, and `posthog_disabled` settings fields to the Pydantic `Settings` class, loaded from environment variables.
- **`app/main.py`** — Initialized PostHog in the `lifespan` context manager on startup (`posthog.api_key`, `posthog.host`, `posthog.debug`), added `posthog.flush()` on shutdown, and registered `PostHogMiddleware`.
- **`app/middleware.py`** — Created a pure ASGI `PostHogMiddleware` that wraps each authenticated request in a `new_context()`, automatically calling `identify_context(user.email)` and tagging `email` for all captured events without any boilerplate in route handlers.
- **`app/routers/auth.py`** — Added `user_signed_up` (with `signup_method`, `initial_credits`), `user_logged_in` (with `login_method`), and `user_logged_out` event tracking.
- **`app/routers/generate.py`** — Added `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) and `insufficient_credits` (with `generation_type`, `credits_needed`, `credits_available`) event tracking.
- **`app/routers/api_keys.py`** — Added `api_key_created` (with `key_name`) and `api_key_revoked` (with `key_name`) event tracking.
- **`app/routers/settings.py`** — Added `settings_updated` (with `fields_changed`) and `password_changed` event tracking.
- **`.env`** — Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User creates a new account — top-of-funnel conversion event | `app/routers/auth.py` |
| `user_logged_in` | User successfully logs in — tracks retention and engagement | `app/routers/auth.py` |
| `user_logged_out` | User logs out — useful for session analysis | `app/routers/auth.py` |
| `content_generated` | User generates AI content — core product action and credit usage event | `app/routers/generate.py` |
| `insufficient_credits` | User tried to generate but had insufficient credits — key churn/upgrade signal | `app/routers/generate.py` |
| `api_key_created` | User created a new API key — signals deeper product adoption | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked an API key — security and usage tracking | `app/routers/api_keys.py` |
| `settings_updated` | User updates their profile/email settings | `app/routers/settings.py` |
| `password_changed` | User changes their password — security action | `app/routers/settings.py` |

## Next Steps

We've designed insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. To create the **"Analytics basics"** dashboard in PostHog, visit your project and add these 5 insights:

1. **Signup to First Generation Funnel** — Funnel: `user_signed_up` → `content_generated` (tracks the core conversion from signup to first AI generation)
2. **Daily Content Generation Trend** — Trends: `content_generated`, broken down by `generation_type` (blog/email/social) over 30 days
3. **User Auth Trend** — Trends: `user_logged_in` + `user_signed_up` over 30 days (daily active users)
4. **Insufficient Credits (Churn Signal)** — Trends: `insufficient_credits` over 30 days (identifies users hitting upgrade triggers)
5. **API Adoption** — Trends (bar): `api_key_created` + `api_key_revoked` over 30 days (tracks developer adoption)

Visit your PostHog project at: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
