<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Acme AI FastAPI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` settings loaded from environment variables via Pydantic Settings.
- **`app/main.py`** — Imported `PostHogMiddleware` and added it to the app. Initialized PostHog (`posthog.api_key`, `posthog.host`, `posthog.debug`) on startup in the lifespan context manager, and calls `posthog.flush()` on shutdown to ensure all queued events are sent.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a `new_context()`. If the user is authenticated (via session cookie), it calls `identify_context(user.email)` and tags the user's email and active status so all route captures are automatically associated with the user.
- **`app/routers/auth.py`** — Added `posthog.identify()` on login and signup to set person properties, plus `capture()` calls for `user_signed_up`, `user_logged_in`, and `user_logged_out`.
- **`app/routers/generate.py`** — Added `capture()` for `content_generated` (on success with generation_type, credits_used, credits_remaining, prompt_length) and `insufficient_credits` (before raising 402 with credits_needed and credits_available).
- **`app/routers/api_keys.py`** — Added `capture()` for `api_key_created` (with active_key_count) and `api_key_revoked`.
- **`app/routers/settings.py`** — Added `capture()` for `settings_updated` (with fields_changed) and `password_changed`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completes registration via the signup form. Top of conversion funnel. | `app/routers/auth.py` |
| `user_logged_in` | Existing user authenticates successfully. Also identifies the user. | `app/routers/auth.py` |
| `user_logged_out` | User ends their session by logging out. | `app/routers/auth.py` |
| `content_generated` | AI content generation succeeds. Core product action and key engagement metric. | `app/routers/generate.py` |
| `insufficient_credits` | Generation attempt fails due to insufficient credits. Key churn/conversion signal. | `app/routers/generate.py` |
| `api_key_created` | User creates a new API key. Indicates developer/programmatic activation. | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivates an API key. | `app/routers/api_keys.py` |
| `settings_updated` | User successfully updates their account settings (e.g., email). | `app/routers/settings.py` |
| `password_changed` | User successfully changes their password. | `app/routers/settings.py` |

## Next steps

We've instrumented all the key events. To build dashboards and insights from these events, visit PostHog:

- [New dashboard — "Analytics basics"](/dashboard)
- Suggested insights to create:
  - **Signup → Login funnel** — `user_signed_up` → `user_logged_in` (conversion funnel)
  - **Content generation trend** — `content_generated` over time, broken down by `generation_type`
  - **Insufficient credits (churn signal)** — `insufficient_credits` over time
  - **API key adoption** — `api_key_created` over time (developer activation)
  - **Settings engagement** — `settings_updated` + `password_changed` trend

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
