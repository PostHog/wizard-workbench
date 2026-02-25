<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`app/config.py`** — Added `posthog_api_key`, `posthog_host`, and `posthog_disabled` settings, loaded from environment variables.
- **`app/main.py`** — Imported `posthog` and `PostHogMiddleware`; initialised PostHog (api_key, host, debug) in the lifespan startup and calls `posthog.flush()` on shutdown; registered `PostHogMiddleware`.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a `new_context()`, and if the user is authenticated it calls `identify_context(user.email)` so all events in that request are automatically associated with the user.
- **`app/routers/auth.py`** — Added `user_logged_in`, `user_signed_up` (each with `identify_context` + `tag`), and `user_logged_out` capture calls.
- **`app/routers/generate.py`** — Added `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`, `prompt_length`) and `generation_failed_insufficient_credits` (critical churn signal) capture calls.
- **`app/routers/api_keys.py`** — Added `api_key_created` (with `active_key_count`) and `api_key_revoked` capture calls.
- **`app/routers/settings.py`** — Added `settings_updated` (with `fields_changed`) and `password_changed` capture calls.
- **`.env`** — `POSTHOG_API_KEY` and `POSTHOG_HOST` written (gitignore-protected).

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user registers an account | `app/routers/auth.py` |
| `user_logged_in` | User authenticates via login form | `app/routers/auth.py` |
| `user_logged_out` | User logs out | `app/routers/auth.py` |
| `content_generated` | AI content successfully generated; includes generation_type and credits_used | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Generation rejected due to insufficient credits — key churn signal | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivates an API key | `app/routers/api_keys.py` |
| `settings_updated` | User updates their account email | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password | `app/routers/settings.py` |

## Next steps

We've designed the following insights and dashboard for you to keep an eye on user behaviour. To create them, visit your PostHog project and build these insights:

**Dashboard: "Analytics basics"** — https://us.posthog.com/project/238460/dashboards

Recommended insights to add:

1. **Signup to First Generation Funnel** — Funnel: `user_signed_up` → `content_generated`. Measures activation rate (how many users generate content after signing up).
2. **Content Generation by Type** — Trends on `content_generated` broken down by `generation_type` property. Shows which content type (blog/email/social) is most popular.
3. **Insufficient Credits — Churn Signal** — Trends on `generation_failed_insufficient_credits`. Users hitting credit limits are at risk of churning or ripe for an upsell.
4. **User Signups Over Time** — Trends on `user_signed_up`. Track growth and marketing effectiveness.
5. **API Key Adoption** — Trends on `api_key_created` and `api_key_revoked`. Indicates power-user / developer engagement.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
