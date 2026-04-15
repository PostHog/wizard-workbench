<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. Here is a summary of all changes made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.
- **`app/config.py`** — Added `posthog_api_key`, `posthog_host`, and `posthog_disabled` settings loaded from environment variables via Pydantic Settings.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI), which wraps every HTTP request in a PostHog context. When a session cookie is present, the authenticated user is identified by email so that all `capture()` calls inside route handlers are automatically associated with the correct user.
- **`app/main.py`** — Initialized PostHog in the lifespan startup (setting `posthog.api_key`, `posthog.host`, `posthog.debug`) and flushes all pending events on shutdown. Registered `PostHogMiddleware`.
- **`app/routers/auth.py`** — Added `user_logged_in` (with `posthog.identify`) on successful login, `user_signed_up` (with `posthog.identify`) on successful signup, and `user_logged_out` on logout.
- **`app/routers/generate.py`** — Added `insufficient_credits` event (churn signal) when a user cannot afford a generation, and `content_generated` event with generation type and credit details after a successful generation.
- **`app/routers/api_keys.py`** — Added `api_key_created` when a new API key is created, and `api_key_revoked` when a key is deactivated.
- **`app/routers/settings.py`** — Added `settings_updated` when a user's email is changed, and `password_changed` when a password update succeeds.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completes registration via signup form | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticates via login form | `app/routers/auth.py` |
| `user_logged_out` | Authenticated user logs out | `app/routers/auth.py` |
| `content_generated` | User successfully generates AI content (blog, email, social); includes generation_type, credits_used, credits_remaining | `app/routers/generate.py` |
| `insufficient_credits` | User attempts to generate content but lacks credits — key churn signal; includes generation_type, credits_needed, credits_available | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User revokes an existing API key | `app/routers/api_keys.py` |
| `settings_updated` | User successfully updates their account email | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password | `app/routers/settings.py` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup-to-generation conversion funnel** — Funnel: `user_signed_up` → `content_generated`. Tracks how many new users go on to generate their first piece of content.
2. **Content generation volume by type** — Trend of `content_generated` broken down by `generation_type` (blog / email / social). Understand which content type drives the most usage.
3. **Insufficient credits events** — Trend of `insufficient_credits` over time. This is your primary churn signal — spikes indicate users hitting the paywall.
4. **New user signups over time** — Trend of `user_signed_up`. Monitor top-of-funnel growth.
5. **API key adoption** — Trend of `api_key_created` vs `api_key_revoked`. Tracks developer/API adoption and key churn.

Create your dashboard here: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
