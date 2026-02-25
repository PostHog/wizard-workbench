<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Acme AI** FastAPI application. The integration adds a pure-ASGI middleware that automatically wraps every HTTP request in a PostHog context and identifies authenticated users, along with targeted event tracking across all key user-facing routes. PostHog is initialised in the FastAPI lifespan context manager and flushed cleanly on shutdown. All credentials are read from environment variables — no keys are hardcoded.

## Files changed

| File | Change |
|---|---|
| `app/config.py` | Added `posthog_api_key`, `posthog_host`, `posthog_disabled` Pydantic Settings fields |
| `app/main.py` | Initialise PostHog on startup, flush on shutdown, register `PostHogMiddleware` |
| `app/middleware.py` | New `PostHogMiddleware` ASGI class — wraps each request in `new_context()`, identifies authenticated users via session cookie |
| `requirements.txt` | Added `posthog>=3.0.0` |
| `.env` | Added `POSTHOG_API_KEY` and `POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers via the signup form | `app/routers/auth.py` |
| `user_logged_in` | Fired when an existing user successfully authenticates via the login form | `app/routers/auth.py` |
| `user_logged_out` | Fired when an authenticated user logs out | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated; includes `generation_type`, `credits_used`, `credits_remaining`, `prompt_length` | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Fired when a content generation request is rejected due to insufficient credits; includes `generation_type`, `credits_needed`, `credits_available` | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key; includes `key_name_length`, `active_key_count` | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their email address; includes `fields_changed` | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when an authenticated user views their dashboard (top of engagement funnel); includes `total_generations`, `credits_remaining`, `api_key_count` | `app/routers/pages.py` |

## Next steps

Create an **"Analytics basics"** dashboard in your PostHog project ([https://us.i.posthog.com/project/238460](https://us.i.posthog.com/project/238460)) and add the following recommended insights:

1. **Signup → Login conversion funnel** — Funnel steps: `user_signed_up` → `user_logged_in` → `dashboard_viewed`
2. **Daily active users** — Trend of unique users firing `dashboard_viewed` over time (DAU proxy)
3. **Content generation by type** — Breakdown of `content_generated` by `generation_type` property (blog / email / social)
4. **Credit exhaustion rate** — Trend of `generation_failed_insufficient_credits` vs `content_generated` — a key churn signal
5. **API key adoption** — Trend of `api_key_created` per week — indicates power-user engagement

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
