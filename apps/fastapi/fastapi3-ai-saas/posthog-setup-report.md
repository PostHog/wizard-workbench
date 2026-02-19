<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **Acme AI FastAPI SaaS application**. PostHog is now initialized via the lifespan context manager, a pure ASGI middleware wraps every request with a per-user PostHog context, and 10 business-critical events are instrumented across 5 route files. Environment variables are stored in `.env` and loaded through Pydantic Settings — no keys are hardcoded.

## Changes summary

| File | Change |
|------|--------|
| `requirements.txt` | Added `posthog>=3.0.0` dependency |
| `app/config.py` | Added `posthog_api_key`, `posthog_host`, `posthog_disabled` settings loaded from env |
| `app/main.py` | Added PostHog initialization in lifespan startup (`posthog.api_key`, `posthog.host`, `posthog.debug`), `posthog.flush()` on shutdown, and `PostHogMiddleware` registration |
| `app/middleware.py` | Implemented `PostHogMiddleware` — a pure ASGI middleware that wraps every HTTP request in a `new_context()`, identifies authenticated users via session cookie, and tags `email` and `credits` properties |
| `app/routers/auth.py` | Added `user_signed_up`, `user_logged_in`, `user_logged_out` events with `new_context()` + `identify_context()` for correct user association |
| `app/routers/generate.py` | Added `content_generated` (core conversion) and `content_generation_failed_insufficient_credits` (churn signal) events with rich properties |
| `app/routers/api_keys.py` | Added `api_key_created` and `api_key_revoked` events |
| `app/routers/settings.py` | Added `settings_updated` and `password_changed` events |
| `app/routers/pages.py` | Added `dashboard_viewed` event with engagement metrics |
| `.env` | Set `POSTHOG_API_KEY` and `POSTHOG_HOST` |

## Event tracking table

| Event name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User created a new account | `app/routers/auth.py` |
| `user_logged_in` | User authenticated and logged in | `app/routers/auth.py` |
| `user_logged_out` | User logged out of their session | `app/routers/auth.py` |
| `content_generated` | User generated AI content (blog, email, social) — core conversion event | `app/routers/generate.py` |
| `content_generation_failed_insufficient_credits` | User tried to generate content but lacked credits — key churn/upgrade signal | `app/routers/generate.py` |
| `api_key_created` | User created a new API key for programmatic access | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked/deactivated an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updated their account settings (email) | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |
| `dashboard_viewed` | User viewed the main dashboard — top of engagement funnel | `app/routers/pages.py` |

## Next steps

We've identified a pre-existing **"Analytics basics"** dashboard in your PostHog project that tracks `user_signed_up` and other compatible events:

- **[Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1274416)** — includes User Signups, Sign-ins, Checkout Conversion Funnel, and Churn indicators

You can also build the following insights directly in PostHog to track Acme AI's key metrics:

- **[Signup → First Generation funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — track conversion from `user_signed_up` to `content_generated` (14-day window)
- **[Content generation volume by type](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — trend of `content_generated` broken down by `generation_type` (blog / email / social)
- **[Insufficient credits — churn signal](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — trend of `content_generation_failed_insufficient_credits` to spot users needing an upgrade
- **[New user signups over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — DAU trend of `user_signed_up`
- **[API key adoption](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — weekly `api_key_created` vs `api_key_revoked` trend

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
