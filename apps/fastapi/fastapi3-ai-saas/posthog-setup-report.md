<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` Pydantic settings fields, loaded from environment variables.
- **`app/analytics.py`** (new) — Initializes the `Posthog` client with `enable_exception_autocapture=True`, and registers `posthog_client.shutdown` with `atexit` to flush events on exit.
- **`app/main.py`** — Imports and flushes the PostHog client in the lifespan shutdown; adds `PostHogMiddleware` that wraps every HTTP request in a PostHog context, identifies authenticated users from their session cookie, and accepts `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers for frontend correlation.
- **`app/routers/auth.py`** — Captures `user_signed_up` (with `signup_method` and `initial_credits`), `user_logged_in`, `login_failed` (anonymous, no person profile), and `user_logged_out`.
- **`app/routers/generate.py`** — Captures `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) and `generation_failed_insufficient_credits` (with `generation_type`, `credits_needed`, `credits_available`).
- **`app/routers/api_keys.py`** — Captures `api_key_created` (with `active_key_count`) and `api_key_revoked`.
- **`app/routers/settings.py`** — Captures `settings_updated` (with `changed_fields`) and `password_changed`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user registers via form; includes signup_method and initial_credits | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticates | `app/routers/auth.py` |
| `login_failed` | Login attempt fails due to invalid credentials | `app/routers/auth.py` |
| `user_logged_out` | User logs out | `app/routers/auth.py` |
| `content_generated` | AI content successfully generated; includes generation_type, credits_used, credits_remaining, prompt_length | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Generation rejected due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User revokes an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updates account settings (e.g. email) | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password | `app/routers/settings.py` |

## Next steps

We've identified the key insights to build in PostHog for monitoring user behavior. Create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup → First generation funnel** — Funnel insight with steps: `user_signed_up` → `content_generated`. Shows what percentage of new signups complete their first AI generation.

2. **Daily active users (logins)** — Trend insight tracking `user_logged_in` over time. Shows engagement and activity patterns.

3. **Content generation by type** — Breakdown trend of `content_generated` broken down by `generation_type` property. Shows which content types (blog, email, social) are most popular.

4. **Credit exhaustion rate** — Trend of `generation_failed_insufficient_credits` over time. A rising trend signals users hitting credit limits — a key churn risk and upsell opportunity.

5. **API key adoption** — Trend of `api_key_created` over time. Shows how many users are integrating programmatically, indicating power-user adoption.

Build these at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
