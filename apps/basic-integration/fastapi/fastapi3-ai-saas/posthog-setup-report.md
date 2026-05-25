<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **PostHog SDK installed** (`posthog>=3.0.0` added to `requirements.txt`).
- **Configuration** (`app/config.py`): Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings fields, loaded from environment variables.
- **Environment** (`.env`): `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written via the wizard-tools MCP server.
- **Lifespan initialization** (`app/main.py`): PostHog is initialized on startup using `posthog.api_key` / `posthog.host` from settings, and flushed gracefully on shutdown.
- **Middleware** (`app/middleware.py`): A pure ASGI `PostHogMiddleware` wraps every HTTP request in a `new_context()`. Authenticated users are automatically identified via `identify_context(user.email)` so all downstream `capture()` calls are correlated to the correct person.
- **Auth routes** (`app/routers/auth.py`): User identity is established at login and signup using `identify_context()` + `tag()`. Events `user_signed_up`, `user_logged_in`, and `user_logged_out` are captured.
- **Generate routes** (`app/routers/generate.py`): The core SaaS value moment — `content_generated` — is captured with `generation_type`, `credits_used`, `credits_remaining`, and `prompt_length`. A critical churn signal, `generation_failed_insufficient_credits`, is captured when a generation attempt is blocked by insufficient credits.
- **API key routes** (`app/routers/api_keys.py`): `api_key_created` (with `active_key_count`) and `api_key_revoked` are captured, indicating deep product engagement.
- **Settings routes** (`app/routers/settings.py`): `settings_updated` (when email changes) and `password_changed` are captured.
- **Pages routes** (`app/routers/pages.py`): `dashboard_viewed` is captured with engagement metadata (`total_generations`, `credits_remaining`, `api_key_count`) — the top of the engagement funnel.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `app/routers/auth.py` |
| `user_logged_in` | Authenticated user completes login | `app/routers/auth.py` |
| `user_logged_out` | User logs out of their session | `app/routers/auth.py` |
| `content_generated` | User successfully generates AI content (blog, email, or social post) | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Generation attempt blocked because user has insufficient credits — key churn signal | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key for programmatic access — signals deep product engagement | `app/routers/api_keys.py` |
| `api_key_revoked` | User revokes an existing API key | `app/routers/api_keys.py` |
| `settings_updated` | User updates their account settings (e.g. email change) | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password | `app/routers/settings.py` |
| `dashboard_viewed` | Authenticated user views their dashboard — top of the engagement funnel | `app/routers/pages.py` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1130112)

Suggested insights to add to the dashboard:

1. **Signup → First Content Generation funnel** — track conversion from `user_signed_up` → `content_generated` to measure activation rate.
2. **Content Generated over time (by type)** — a trend of `content_generated` broken down by `generation_type` (blog / email / social).
3. **Credit Depletion trend** — trend of `generation_failed_insufficient_credits` — rising numbers signal users hitting paywalls and a monetization opportunity.
4. **API Key Creation trend** — trend of `api_key_created` — a leading indicator of power-user engagement.
5. **User Acquisition trend** — trend of `user_signed_up` over time.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
